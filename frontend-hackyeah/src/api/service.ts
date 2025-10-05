import { api } from ".";

export const service = {
    getTrip: (tripId: string) => {
        return api.get(`/map/?tripId=${tripId}`)
    },
    createReport: (data: any) => {

        return api.post("/report", data)
    },
    login: (login: string, password: string) => {
        return api.post("/login", { username: login, password })
    },
    getPoints: (userId: number) => {
        return api.get(`/report-get-counts/?userId=${userId}`)
    },
    addTicket: (userId: number, ticketId: string) => {
        return api.post("/ticket-update", { userId, ticketId })
    },
    getTicket: (userId: number, ticketid: string) => {
        return api.get(`/ticket?userId=${userId}&ticketId=${ticketid}`)
    },
    getAllTickets: (userId: number) => {
        return api.get(`/tickets-all?userId=${userId}`)
    },
    deleteTicket: (userId: number, reportId: number) => {
        return api.get(`/delete-report?userId=${userId}&reportId=${reportId}`)
    },
    disproveReport: (userId: number, reportId: number) => {
        return api.get(`/disprove-report?userId=${userId}&reportId=${reportId}`)
    },
    confirmReport: (userId: number, reportId: number) => {
        return api.get(`/confirm-report?userId=${userId}&reportId=${reportId}`)
    },
    analyzeTrip: (tripId: string) => {
        return api.get(`/analyze-trip?tripId=${tripId}`)
    },
    getTrain: (tripId: string) => {
        return api.get(`/train?tripId=${tripId}`)
    }
}