import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApiTest() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/test')
            .then(response => {
                setMessage(response.data.message);
                setLoading(false);
            })
            .catch(error => {
                setError('Lỗi khi gọi API: ' + error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Kết quả từ API:</h2>
            <p>{message}</p>
        </div>
    );
}

export default ApiTest;