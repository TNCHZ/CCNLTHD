const MyAccountReducer = (currentState, action) => { //currentState thay bằng useState, trạng thái account đăng nhập
    switch (action.type) {
        case "login": {
            return {
                "username": action.payload.username,
                "password": action.payload.password
            }; //trả về thong tin đăng nhập
        }
        case "logout": {
            return action.payload = null; //đối tượng account là null
        }
    }
    return currentState;
}

export default MyAccountReducer;