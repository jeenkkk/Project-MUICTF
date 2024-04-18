export const handleError = (error) => {
    if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
            case 400:
                window.location.href = '/400';
                break;
            case 403:
                window.location.href = '/403';
                break;
            case 404:
                window.location.href = '/404';
                break;
            case 500:
                window.location.href = '/500';
                break;
            default:
                break;
        }
        
    } else {
        // Handle other types of errors (e.g., network errors)
        console.error('An error occurred:', error.message);
    }
};