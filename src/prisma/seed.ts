import prisma from "@/utils/prisma";
import { Role } from "@prisma/client";

async function main(){
    const patient1 = await prisma.user.upsert({
        where: { email : "patient@example.com" },
        update: {},
        create: {
            name: "Patient1",
            email: "patient@example.com",
            password: "pass",
            role: Role.PATIENT,
        },
    })

    const doctor1 = await prisma.user.upsert({
        where: { email : "doctor@example.com" },
        update: {},
        create: {
            name: "Doctor1",
            email: "doctor@example.com",
            password: "pass",
            role: Role.DOCTOR,
        },
    })

    await prisma.medicalRecord.create({
        data: {
            patientId: patient1.id,
            doctorId: doctor1.id,
            diagnosis: "hemorrhoid",
            prescription: "Test",
            medications: [
                {
                    name: "Aspirin",
                    dosage: "500mg",
                    quantity: 20,
                    instructions: "Take 2 tablets daily"
                },
            ],
            isAcceptedStatus: "accepted",
            notes: "Follow up again in one week",
        }
    })

    console.log("Seeding completed successfully")
}

main().
    catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })