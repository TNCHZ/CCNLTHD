const MyAccountReducer = (currentState, action) => { //currentState thay bằng useState, trạng thái account đăng nhập
    switch (action.type) {
        case "login": {
            return action.payload; //trả về thong tin đăng nhập
        }
        case "logout": {
            return null; //đối tượng account là null
        }
    }
    return currentState;
}

export default MyAccountReducer;