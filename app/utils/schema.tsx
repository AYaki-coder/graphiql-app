import * as yup from 'yup';

export const signSchema = yup.object().shape({
  email: yup.string().email('Enter valid email!').required('Enter your email!'),
  password: yup
    .string()
    .required('Enter your password')
    .matches(/([0-9])/, 'Must Contain One number ')
    .matches(/([\p{L}])/u, 'Must Contain One letter ')
    .matches(/([^\p{L}0-9])/u, 'Must Contain one special character ')
    .min(8)
    .required('Set password'),
});

export const signSchemaRu = yup.object().shape({
  email: yup.string().email('Введите верную почту').required('Введите почту'),
  password: yup
    .string()
    .required('Введите пароль')
    .matches(/([0-9])/, 'Должен содержать одну цифру ')
    .matches(/([\p{L}])/u, 'Должен содержать одну букву ')
    .matches(/([^\p{L}0-9])/u, 'Должен содержать один спецсимвол ')
    .min(8)
    .required('Установите пароль'),
});
