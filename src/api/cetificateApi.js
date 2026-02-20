import api from './axios';

export const certificateApi = {
    getMyCertificates: () => {
        return api.get('/donor/certificates');
    },

    getCertificateDetails: (id) => {
        return api.get(`/donor/certificates/${id}`);
    },

    downloadCertificate: (id) => {
        return api.get(`/donor/certificates/${id}/download`, {
            responseType: 'blob'
        });
    }
}