export const roles = {
    admin: 1,
    vendor: 2,
    user: 3,
};

export const findkey = (value: number) => {
    return (Object.keys(roles) as (keyof typeof roles)[])
        .find(key => roles[key] === value);
}

export const getValue = (key: keyof typeof roles) => {
    return roles[key];
};

export default {roles,findkey,getValue}