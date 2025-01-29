const MyAccountReducer = (currentState, action) => { //currentState thay bằng useState, trạng thái account đăng nhập
    switch (action.type) {
        case "login": {
            return {
                "avatar": action.payload.avatar,
                "first_name": action.payload.first_name,
                "last_name": action.payload.last_name,
                "role": action.payload.role,
                "username": action.payload.username,
                "password": action.payload.password
            }; //trả về thong tin đăng nhập
                ...currentState,
                username: action.payload.username,
                id: action.payload.id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                role: action.payload.role,
            };
        }
        case "logout": {
            return action.payload = null; //đối tượng account là null
        }
    }
    return currentState;
}

export default MyAccountReducer;