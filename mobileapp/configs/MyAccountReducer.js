const MyAccountReducer = (currentState, action) => {
    switch (action.type) {
        case "login": {
            return {
                ...currentState,
                username: action.payload.username,
                id: action.payload.id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                role: action.payload.role,
            };
        }
        case "logout": {
            return null;
        }
        default:
            return currentState;
    }
};

export default MyAccountReducer;