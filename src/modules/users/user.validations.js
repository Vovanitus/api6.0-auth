import Joi from 'joi';

export const passwordReg = /(?=.*)(?=.*[a-z])(?=.*[A-Z].{6,})/;
export default {
    signup: {
        body: {
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .regex(passwordReg)
                .required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            userName: Joi.string().required(),
        },
    },
};
