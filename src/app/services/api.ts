// REST API für Geburtstags-Anmeldungen
const API_BASE_URL = 'https://anettkuehfuss.de/api';

export interface Confirmation {
  _id: string;
  names: string[];
  email: string;
  createdAt?: string;
}

export interface Cancellation {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// POST /api/users - Zusage erstellen
export async function createConfirmation(
  confirmation: { names: string[]; email: string }
): Promise<ApiResponse<Confirmation>> {
  try {
    console.log('Sending request to:', `${API_BASE_URL}/users`);
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        names: confirmation.names,
        email: confirmation.email,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Error creating confirmation:', error);
    let errorMessage = 'Fehler beim Speichern der Zusage';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// GET /api/users - Alle Zusagen abrufen
export async function getConfirmations(): Promise<ApiResponse<Confirmation[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Error fetching confirmations:', error);
    let errorMessage = 'Fehler beim Abrufen der Zusagen';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// DELETE /api/users/:id - Einzelne Zusage löschen
export async function deleteConfirmation(id: string): Promise<ApiResponse<void>> {
  try {
    console.log('Sending delete request to:', `${API_BASE_URL}/users/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting confirmation:', error);
    let errorMessage = 'Fehler beim Löschen der Zusage';
    if (error instanceof Error) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
}

// POST /api/users/declined - Absage erstellen
export async function createCancellation(
  cancellation: { name: string }
): Promise<ApiResponse<Cancellation>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/declined`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: cancellation.name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Error creating cancellation:', error);
    let errorMessage = 'Fehler beim Speichern der Absage';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// GET /api/users/declined - Alle Absagen abrufen
export async function getCancellations(): Promise<ApiResponse<Cancellation[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/declined`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Error fetching cancellations:', error);
    let errorMessage = 'Fehler beim Abrufen der Absagen';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// DELETE /api/users/declined/:id - Einzelne Absage löschen
export async function deleteCancellation(id: string): Promise<ApiResponse<void>> {
  try {
    console.log('Sending delete request to:', `${API_BASE_URL}/users/declined/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/users/declined/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting cancellation:', error);
    let errorMessage = 'Fehler beim Löschen der Absage';
    if (error instanceof Error) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
}