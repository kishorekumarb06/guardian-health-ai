import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test user (Admin)
    const user = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "john@example.com",
            password: hashedPassword,
            role: "ADMIN",
            phone: "+1 (555) 123-4567",
            bloodType: "O+",
            allergies: "Penicillin, Peanuts",
            emergencyNotes: "Has a pacemaker. In case of emergency, contact Dr. Sarah Chen immediately.",
        },
    });

    // Seed Contacts
    await prisma.contact.createMany({
        data: [
            {
                userId: user.id,
                name: "Dr. Sarah Chen",
                relationship: "Primary Physician",
                email: "dr.chen@clinic.com",
                avatar: "SC",
                autoCall: true,
                sosSms: true,
                appAlerts: true,
                isEmergencyContact: true,
            },
            {
                userId: user.id,
                name: "James Mitchell",
                relationship: "Emergency Contact",
                email: "james.m@example.com",
                avatar: "JM",
                autoCall: true,
                sosSms: false,
                appAlerts: true,
                isEmergencyContact: true,
            },
            {
                userId: user.id,
                name: "Maria Rodriguez",
                relationship: "Spouse",
                email: "maria.r@example.com",
                avatar: "MR",
                autoCall: true,
                sosSms: true,
                appAlerts: true,
                isEmergencyContact: true,
            }
        ]
    });

    // Seed Health History
    const now = new Date();
    await prisma.healthEvent.createMany({
        data: [
            { userId: user.id, date: now, description: "Routine vitals check", status: "normal" },
            { userId: user.id, date: new Date(now.getTime() - 86400000), description: "Mild heart rate elevation", status: "warning" },
            { userId: user.id, date: new Date(now.getTime() - 86400000 * 2), description: "All vitals normal", status: "normal" },
            { userId: user.id, date: new Date(now.getTime() - 86400000 * 3), description: "SpO2 dip detected — resolved", status: "warning" },
            { userId: user.id, date: new Date(now.getTime() - 86400000 * 5), description: "Fall risk assessment passed", status: "normal" }
        ]
    });

    // Seed Telemetry
    await prisma.telemetry.create({
        data: {
            userId: user.id,
            transmission: 82,
            location: "37.7749° N, 122.4194° W",
            heartRate: 72,
            spO2: 98,
            ambientAudio: "Active — Monitoring"
        }
    });

    // Seed Vitals
    await prisma.vitalSign.create({
        data: {
            userId: user.id,
            heartRate: 72,
            bodyTemp: 98.6,
            spO2: 98,
            bloodPressure: "120/80",
            steps: 4287,
            riskLevel: "LOW"
        }
    });

    // Seed Medical Records
    await prisma.medicalRecord.createMany({
        data: [
            { userId: user.id, title: "Annual Physical Results", date: new Date('2023-11-15'), provider: "Dr. Sarah Chen", documentUrl: "#" },
            { userId: user.id, title: "Cardiology Report", date: new Date('2023-09-22'), provider: "Heart Center USA", documentUrl: "#" },
            { userId: user.id, title: "Blood Work Panel", date: new Date('2023-11-10'), provider: "Quest Diagnostics", documentUrl: "#" }
        ]
    });

    console.log(`Database seeded! User ID is: ${user.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
