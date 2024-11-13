const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [],
    newGeneratedUrl: ''
  }
  
  const getIndex = (arr, arr2, arr3, params = {}) => {
    if (arr2.length > 0) {
      let startIndex = arr.findIndex(i => i.id === arr2[0].id) + 1
      let endIndex = arr.findIndex(i => i.id === arr2[arr2.length - 1].id) + 1
      let finalArr = [startIndex, endIndex]
      return (arr3 = finalArr)
    } else {
      let finalArr = [arr.length - parseInt(params.perPage), arr.length]
      return (arr3 = finalArr)
    }
  }
  

const basicReducer = (state = initialState, action) => {
  switch (action.type) {
      case "GET_BASIC_DATA":
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          sortIndex: getIndex(
            action.data,
            action.data,
            state.sortIndex,
            action.params
          )
        }
      case "GET_BASIC_ALL_DATA":
        return {
          ...state,
          allData: action.data,
          totalRecords: action.data.length,
          sortIndex: getIndex(action.data, state.data, state.sortIndex)
        }
      case "FILTER_BASIC_DATA":
        let value = action.value
        let filteredData = []
        if (value.length) {
          filteredData = state.allData
            .filter(item => {
              let startsWithCondition =
                item.name.toLowerCase().startsWith(value.toLowerCase()) ||
                item.time.toLowerCase().startsWith(value.toLowerCase())
  
              let includesCondition =
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.time.toLowerCase().includes(value.toLowerCase())
  
              if (startsWithCondition) {
                return startsWithCondition
              } else if (!startsWithCondition && includesCondition) {
                return includesCondition
              } else return null
            })
            .slice(state.params.page - 1, state.params.perPage)
          return { ...state, filteredData }
        } else {
          filteredData = state.data
          return { ...state, filteredData }
        }
    //   case "UPDATE_BASIC_DATA":
    //     // console.log("item: ", state.data, "obj:", action.obj);
    //     state.data.find(item => {
    //       console.log("item", item)
    //       if (item._id === action.obj._id) {
    //         item.name = action.obj.name
    //         item.time = parseInt(action.obj.time)
    //         return item
    //       }
    //     })
    //     console.log(state.data)
    //     return { ...state }
      case "ADD_BASIC_DATA":
        state.data.push(action.data)
        return { ...state }
      case "DELETE_BASIC_DATA":
        let index = state.data.findIndex(item => item.id === action.obj.id)
        let updatedData = [...state.data]
        updatedData.splice(index, 1)
        return {
          ...state,
          data: updatedData,
          totalRecords: state.allData.length,
          sortIndex: getIndex(
            state.allData,
            state.data,
            state.sortIndex,
            state.params
          )
        }
      default:
        return state
  }
}

export default basicReducer  
