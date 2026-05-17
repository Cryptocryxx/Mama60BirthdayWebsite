// REST API für Geburtstags-Anmeldungen
const API_BASE_URL = 'https://anettkuehfuss.de/api';

export interface Confirmation {
  _id: string;
  names: string[];
  email: string;
}

export interface Cancellation {
  _id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Simuliere Netzwerk-Verzögerung für localStorage-basierte Funktionen
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// POST /api/users - Zusage erstellen
export async function createConfirmation(
  confirmation: { names: string[]; email: string }
): Promise<ApiResponse<Confirmation>> {
  try {
    console.log('Sending request to:', `${API_BASE_URL}/users`);
    console.log('Request body:', { names: confirmation.names, email: confirmation.email });

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

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Confirmation created:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error creating confirmation:', error);

    // Detaillierte Fehlermeldung
    let errorMessage = 'Fehler beim Speichern der Zusage';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// GET /api/users - Alle Zusagen abrufen
export async function getConfirmations(): Promise<ApiResponse<Confirmation[]>> {
  try {
    console.log('Fetching from:', `${API_BASE_URL}/users`);

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Confirmations fetched:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching confirmations:', error);

    // Detaillierte Fehlermeldung
    let errorMessage = 'Fehler beim Abrufen der Zusagen';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// POST /api/declined - Absage erstellen
export async function createCancellation(
  cancellation: { name: string }
): Promise<ApiResponse<Cancellation>> {
  try {
    console.log('Sending cancellation to:', `${API_BASE_URL}/declined`);
    console.log('Request body:', { name: cancellation.name });

    const response = await fetch(`${API_BASE_URL}/declined`, {
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

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cancellation created:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error creating cancellation:', error);

    let errorMessage = 'Fehler beim Speichern der Absage';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// GET /api/declined - Alle Absagen abrufen
export async function getCancellations(): Promise<ApiResponse<Cancellation[]>> {
  try {
    console.log('Fetching cancellations from:', `${API_BASE_URL}/declined`);

    const response = await fetch(`${API_BASE_URL}/declined`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cancellations fetched:', data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching cancellations:', error);

    let errorMessage = 'Fehler beim Abrufen der Absagen';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Verbindung zum Server fehlgeschlagen. CORS oder Netzwerkfehler.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// DELETE /api/confirmations - Alle Zusagen löschen
export async function deleteAllConfirmations(): Promise<ApiResponse<void>> {
  await delay(200);

  try {
    localStorage.removeItem('birthday-confirmations');
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Löschen der Zusagen',
    };
  }
}

// DELETE /api/cancellations - Alle Absagen löschen
export async function deleteAllCancellations(): Promise<ApiResponse<void>> {
  await delay(200);

  try {
    localStorage.removeItem('birthday-cancellations');
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Löschen der Absagen',
    };
  }
}

// GET /api/stats - Statistiken abrufen
export async function getStats(): Promise<ApiResponse<{
  totalConfirmations: number;
  totalGuests: number;
  totalCancellations: number;
}>> {
  await delay(150);

  try {
    const confirmations: Confirmation[] = JSON.parse(
      localStorage.getItem('birthday-confirmations') || '[]'
    );
    const cancellations: Cancellation[] = JSON.parse(
      localStorage.getItem('birthday-cancellations') || '[]'
    );

    const totalGuests = confirmations.reduce((sum, conf) => sum + conf.guestCount, 0);

    return {
      success: true,
      data: {
        totalConfirmations: confirmations.length,
        totalGuests,
        totalCancellations: cancellations.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Fehler beim Abrufen der Statistiken',
    };
  }
}
