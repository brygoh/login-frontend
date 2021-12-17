export const errorValidation = (data, field, value) => {
    if (field === 'name') {
        if (/[^a-zA-Z ]+$/.test(value))
            return 'Namefield can only have CHARACTERS only!'
        else if (value === '')
            return 'Namefield cannot be left empty'
        else
            return ''
    }
    else if (field === 'email') {
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value))
            return 'Invalid Email format!'
        else if (value === '')
            return 'Emailfield cannot be left empty'
        else if (data.find(({ email }) => email === value))
            return 'Duplicate emails'
        else
            return ''
    }
}