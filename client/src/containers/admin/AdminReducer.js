
const AdminReducer = (state = [], action) => {
  switch (action.type) {
    case "ADMIN_LOGIN_SUCCESS":
      return { ...state, user: action.payload };
    case "ADMIN_LOGIN_ERROR":
      return { ...state, userError: action.payload };
    case "ADMIN_CREATE_CHANNEL_SUCCESS":
      return { ...state, channel: action.payload };
    case "ADMIN_CREATE_CHANNEL_ERROR":
      return { ...state, channelError: action.payload };
    case "ADMIN_JOIN_CHANNEL_SUCCESS":
      return { ...state, channelJoin: action.payload };
    case "ADMIN_JOIN_CHANNEL_ERROR":
      return { ...state, channelJoinError: action.payload };
    case "ADMIN_INSTALL_CC_SUCCESS":
      return { ...state, installCCSuccess: action.payload };
    case "ADMIN_INSTALL_CC_ERROR":
      return { ...state, installCCError: action.payload };
      case "ADMIN_INSTANTIATED_CC_SUCCESS":
      return { ...state, instantiatedCCSuccess: action.payload };
    case "ADMIN_INSTANTIATED_CC_ERROR":
      return { ...state, instantiatedCCErrpr: action.payload };
    case "UPDATE_ADMIN_CC_INFO":
      return { ...state, ccInfo: action.payload};
   
    default:
      return state
  }
}

export default AdminReducer