const { init } = require('../src')

describe('redux:', () => {
	test('combineReducers should replace root', () => {
		const store = init({
			redux: {
				initialState: {},
				reducers: {
					a: () => 12,
					b: () => 27,
				},
				combineReducers: () => () => 42,
			},
		})
		expect(store.getState()).toBe(42)
	})
	test('should not accept invalid value as "redux.combineReducers"', () => {
		expect(() =>
			init({
				redux: {
					combineReducers: 42,
				},
			})
		).toThrow()
	})

	test('combineReducers should replace root', () => {
		const store = init({
			redux: {
				initialState: {},
				createStore: () => ({
					getState: () => 42,
				}),
			},
		})
		expect(store.getState()).toBe(42)
	})

	test('model baseReducer should run', () => {
		const libAction = 'fromRedux'
		const libReducer = (state = {}, action) => {
			switch (action.type) {
				case libAction:
					return {
						message: action.payload,
						...state,
					}
				default:
					return state
			}
		}
		const store = init({
			models: {
				chicken: {
					baseReducer: libReducer,
					effects: dispatch => ({
						dinner() {
							return dispatch({ type: libAction, payload: 'winner' })
						},
					}),
				},
			},
		})
		store.dispatch.chicken
			.dinner()
			.then(() => expect(store.getState().chicken.message).toBe('winner'))
	})

	test('should not accept invalid value as "redux.createStore"', () => {
		expect(() =>
			init({
				redux: {
					createStore: 42,
				},
			})
		).toThrow()
	})
})
