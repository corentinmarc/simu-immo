import {
    SET_INTEREST_RATE,
    SET_INSURANCE_RATE,
    SET_DURATION,
    SET_CAPITAL,
    SET_FORM_VALUE,
} from 'constants/actions/form';

const setFormValue = (state, payload) => {
    return {...state, ...payload};
};

const initialState = {
    capital: '300000',
    interestRate: '2',
    insuranceRate: '0.5',
    duration: '25',
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FORM_VALUE:
            return setFormValue(state, action.payload);
        case SET_INTEREST_RATE:
            const { interestRate } = action.payload;
            return setFormValue(state, { interestRate });
        case SET_INSURANCE_RATE:
            const { insuranceRate } = action.payload;
            return setFormValue(state, { insuranceRate });
        case SET_DURATION:
            const { duration } = action.payload;
            return setFormValue(state, { duration });
        case SET_CAPITAL:
            const { capital } = action.payload;
            return setFormValue(state, { capital });
        default:
            return state
    }
};

export default formReducer;