
const API_BASE_URL = '/api';

export async function fetchData(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('hrmsToken')}`,
      ...options.headers
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchData(endpoint),
  
  post: (endpoint: string, data: any) => fetchData(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint: string, data: any) => fetchData(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint: string) => fetchData(endpoint, {
    method: 'DELETE',
  }),
  
  upload: async (endpoint: string, file: File, fieldName: string = 'file') => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('hrmsToken')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }
    
    return response.json();
  }
};
