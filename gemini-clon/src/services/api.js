const BASE_URL = 'http://localhost:4000/api';

export const checkEmailExists = async (email) => {
    const res = await fetch(`${BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    return res.json();
};


export const registerUser = async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    return res.json();
};

export const loginUser = async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    return res.json();
};
