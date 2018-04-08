
const FisherManReducer = (state = [], action) => {
  switch (action.type) {
    case "FISHERMAN_INIT_LEDGER_SUCCESS":
      return { ...state, initSuccess: action.payload };
    case "FISHERMAN_INIT_LEDGER_ERROR":
      return { ...state, initError: action.payload };

    case "FISHERMAN_QUERY_ALL_TUNA_SUCCESS":
      return { ...state, allTunaSuccess: action.payload };
    case "FISHERMAN_QUERY_ALL_TUNA_ERROR":
      return { ...state, allTunaError: action.payload };

    default:
      return state
  }
}

export default FisherManReducer