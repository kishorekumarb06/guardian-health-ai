import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    bloodType: string;
}

export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`http://${window.location.hostname}:3000/api/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

            <div className="space-y-4">
                {users.map(user => (
                    <div
                        key={user.id}
                        className="p-4 rounded-xl border medical-shadow"
                    >
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Blood Type:</strong> {user.bloodType}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}