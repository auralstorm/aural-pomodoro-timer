use tauri::{
    menu::{Menu, MenuBuilder, MenuItem, SubmenuBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn show_assistant_menu(
    window: tauri::WebviewWindow,
    position_locked: bool,
    always_on_top: bool,
) -> Result<(), String> {
    let app = window.app_handle();

    let lock_text = if position_locked {
        "🔓 解锁位置"
    } else {
        "🔒 锁定位置"
    };
    let top_text = if always_on_top {
        "📌 取消置顶"
    } else {
        "📌 置顶窗口"
    };

    let toggle_lock =
        MenuItem::with_id(app, "toggle_lock", lock_text, true, None::<&str>)
            .map_err(|e| e.to_string())?;
    let toggle_top =
        MenuItem::with_id(app, "toggle_top", top_text, true, None::<&str>)
            .map_err(|e| e.to_string())?;

    let start_focus =
        MenuItem::with_id(app, "start_focus", "▶️ 开始专注", true, None::<&str>)
            .map_err(|e| e.to_string())?;
    let pause = MenuItem::with_id(app, "pause", "⏸️ 暂停番茄", true, None::<&str>)
        .map_err(|e| e.to_string())?;
    let reset = MenuItem::with_id(app, "reset", "⏹️ 结束番茄", true, None::<&str>)
        .map_err(|e| e.to_string())?;
    let switch_mode =
        MenuItem::with_id(app, "switch_mode", "🔄 切换专注/休息", true, None::<&str>)
            .map_err(|e| e.to_string())?;
    let show_stats =
        MenuItem::with_id(app, "show_stats", "📊 查看今日进度", true, None::<&str>)
            .map_err(|e| e.to_string())?;

    let headpat =
        MenuItem::with_id(app, "headpat", "🤗 摸头杀", true, None::<&str>)
            .map_err(|e| e.to_string())?;
    let cheer = MenuItem::with_id(app, "cheer", "💪 加油打气", true, None::<&str>)
        .map_err(|e| e.to_string())?;
    let celebrate =
        MenuItem::with_id(app, "celebrate", "🎉 撒花庆祝", true, None::<&str>)
            .map_err(|e| e.to_string())?;

    let open_settings =
        MenuItem::with_id(app, "open_settings", "⚙️ 打开设置面板", true, None::<&str>)
            .map_err(|e| e.to_string())?;
    let exit_assistant =
        MenuItem::with_id(app, "exit_assistant", "❌ 退出助手", true, None::<&str>)
            .map_err(|e| e.to_string())?;

    let model_sub = SubmenuBuilder::new(app, "🎮 模型控制")
        .item(&toggle_lock)
        .item(&toggle_top)
        .build()
        .map_err(|e| e.to_string())?;

    let focus_sub = SubmenuBuilder::new(app, "⏱️ 专注联动")
        .item(&start_focus)
        .item(&pause)
        .item(&reset)
        .item(&switch_mode)
        .separator()
        .item(&show_stats)
        .build()
        .map_err(|e| e.to_string())?;

    let easter_sub = SubmenuBuilder::new(app, "😊 互动彩蛋")
        .item(&headpat)
        .item(&cheer)
        .item(&celebrate)
        .build()
        .map_err(|e| e.to_string())?;

    let menu = MenuBuilder::new(app)
        .item(&model_sub)
        .item(&focus_sub)
        .item(&easter_sub)
        .separator()
        .item(&open_settings)
        .item(&exit_assistant)
        .build()
        .map_err(|e| e.to_string())?;

    let win = window.clone();
    window.on_menu_event(move |_w, event| {
        let action = event.id().as_ref();
        let _ = win.emit("assistant-menu-action", action);
        if action == "show_stats" || action == "open_settings" {
            show_main_window(win.app_handle());
        }
    });

    window
        .popup_menu(&menu)
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let show_item = MenuItem::with_id(app, "show", "显示主窗口", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "退出应用", true, None::<&str>)?;
            let tray_menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            let tray_icon = app
                .default_window_icon()
                .cloned()
                .expect("default window icon is required for tray support");

            TrayIconBuilder::with_id("main-tray")
                .icon(tray_icon)
                .tooltip("番茄时钟")
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => show_main_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main_window(tray.app_handle());
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, show_assistant_menu])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
