import NotificationModal from "../testing/NotificationModal"

export default function OfficeHeader() {
    return (
        <header className="mb-6">
            <h1 className="text-2xl font-bold">Office Dashboard</h1>
            <NotificationModal />
        </header>
    )
}