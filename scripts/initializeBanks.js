/**
 * Script to initialize Pakistan banks in Firestore
 * Run with: node scripts/initializeBanks.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAWwZ9f46HBmsyFme-7-rEF9hH-j1nLmxw",
  authDomain: "clothesonrent-bc27e.firebaseapp.com",
  projectId: "clothesonrent-bc27e",
  storageBucket: "clothesonrent-bc27e.firebasestorage.app",
  messagingSenderId: "613854293169",
  appId: "1:613854293169:web:3dcef0861ff600b3368690",
  measurementId: "G-ZL3QSQSDZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pakistanBanks = [
    { name: 'Allied Bank Limited', code: 'ABL', accountNumber: '0012345678901', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK36ABPA0001234567890123' },
    { name: 'Askari Bank', code: 'AKBL', accountNumber: '0023456789012', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK37ASCM0002345678901234' },
    { name: 'Bank Alfalah', code: 'BAFL', accountNumber: '0034567890123', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK38ALFH0003456789012345' },
    { name: 'Bank Al-Habib', code: 'BAHL', accountNumber: '0045678901234', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK39BAHL0004567890123456' },
    { name: 'Bank of Punjab', code: 'BOP', accountNumber: '0056789012345', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK40BPUN0005678901234567' },
    { name: 'Faysal Bank', code: 'FBL', accountNumber: '0067890123456', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK41FAYS0006789012345678' },
    { name: 'Habib Bank Limited', code: 'HBL', accountNumber: '0078901234567', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK42HABB0007890123456789' },
    { name: 'JS Bank', code: 'JSBL', accountNumber: '0089012345678', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK43JSBL0008901234567890' },
    { name: 'MCB Bank', code: 'MCB', accountNumber: '0090123456789', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK44MUCB0009012345678901' },
    { name: 'Meezan Bank', code: 'MEBL', accountNumber: '0101234567890', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK45MEZN0001012345678901' },
    { name: 'National Bank of Pakistan', code: 'NBP', accountNumber: '0112345678901', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK46NBPA0001123456789012' },
    { name: 'Standard Chartered Bank', code: 'SCB', accountNumber: '0123456789012', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK47SCBL0001234567890123' },
    { name: 'United Bank Limited', code: 'UBL', accountNumber: '0134567890123', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK48UNIL0001345678901234' },
    { name: 'Bank Islami', code: 'BIPL', accountNumber: '0145678901234', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK49BKIP0001456789012345' },
    { name: 'Dubai Islamic Bank', code: 'DIB', accountNumber: '0156789012345', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK50DUIB0001567890123456' },
    { name: 'Sindh Bank', code: 'SBL', accountNumber: '0167890123456', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK51SINB0001678901234567' },
    { name: 'Soneri Bank', code: 'SNBL', accountNumber: '0178901234567', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK52SONE0001789012345678' },
    { name: 'Summit Bank', code: 'SMBL', accountNumber: '0189012345678', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK53SUMM0001890123456789' },
    { name: 'Zarai Taraqiati Bank', code: 'ZTBL', accountNumber: '0190123456789', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK54ZTBL0001901234567890' },
    { name: 'Al Baraka Bank', code: 'ABPL', accountNumber: '0201234567890', accountTitle: 'Clothes On Rent Pvt Ltd', iban: 'PK55ABPL0002012345678901' },
];

async function initializeBanks() {
    try {
        console.log('🔄 Starting bank initialization...');
        
        // Check if banks already exist
        const banksSnapshot = await getDocs(collection(db, 'banks'));
        const existingBanks = [];
        banksSnapshot.forEach((doc) => {
            existingBanks.push({ id: doc.id, ...doc.data() });
        });

        if (existingBanks.length > 0) {
            console.log(`⚠️  Found ${existingBanks.length} existing banks.`);
            console.log('   To re-initialize, delete existing banks first or use force mode.');
            return { success: false, message: 'Banks already exist', count: existingBanks.length };
        }

        // Add banks to collection
        const addedBanks = [];
        console.log(`📝 Adding ${pakistanBanks.length} banks to Firestore...`);
        
        for (const bank of pakistanBanks) {
            try {
                const docRef = await addDoc(collection(db, 'banks'), {
                    ...bank,
                    createdAt: new Date().toISOString(),
                    isActive: true
                });
                addedBanks.push({ id: docRef.id, name: bank.name });
                console.log(`   ✅ Added: ${bank.name}`);
            } catch (error) {
                console.error(`   ❌ Error adding ${bank.name}:`, error.message);
            }
        }

        console.log(`\n✅ Successfully initialized ${addedBanks.length} Pakistan banks!`);
        return { success: true, message: `Added ${addedBanks.length} banks`, count: addedBanks.length };
    } catch (error) {
        console.error('❌ Error initializing banks:', error);
        throw error;
    }
}

// Run the initialization
initializeBanks()
    .then((result) => {
        if (result.success) {
            console.log('\n🎉 Bank initialization completed successfully!');
            process.exit(0);
        } else {
            console.log('\n⚠️  Bank initialization skipped (banks already exist)');
            process.exit(0);
        }
    })
    .catch((error) => {
        console.error('\n❌ Failed to initialize banks:', error);
        process.exit(1);
    });

