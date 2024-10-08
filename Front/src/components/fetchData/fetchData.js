

//const URL_PRINCIPAL = 'http://localhost:3000/api/v1';
const URL_PRINCIPAL = 'https://back-proyecto10-three.vercel.app/api/v1';

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(`${URL_PRINCIPAL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }

    return response;
  } catch (error) {
    console.error('Error en la llamada fetch:', error);
    throw error;
  }
};

export const GET = (url) => fetchData(url, { method: 'GET' });
export const POST = (url, data) => fetchData(url, { method: 'POST', body: JSON.stringify(data) });
export const PUT = (url, data) => fetchData(url, { method: 'PUT', body: JSON.stringify(data) });
export const DELETE = (url, data) => fetchData(url, { method: 'DELETE', body: JSON.stringify(data) });
