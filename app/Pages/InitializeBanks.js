import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { forceInitializePakistanBanks, getBanks, initializePakistanBanks } from '../Helper/firebaseHelper';

const InitializeBanks = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(false);

    const handleInitializeBanks = async () => {
        try {
            setLoading(true);
            const result = await initializePakistanBanks();
            
            if (result.success) {
                Alert.alert(
                    'Success',
                    result.message + `\nTotal banks: ${result.count}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                loadBanks();
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error initializing banks:', error);
            Alert.alert('Error', 'Failed to initialize banks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForceInitialize = async () => {
        Alert.alert(
            'Confirm',
            'This will delete all existing banks and recreate them. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Continue',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const result = await forceInitializePakistanBanks();
                            
                            if (result.success) {
                                Alert.alert(
                                    'Success',
                                    result.message + `\nTotal banks: ${result.count}`,
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                loadBanks();
                                            }
                                        }
                                    ]
                                );
                            }
                        } catch (error) {
                            console.error('Error force initializing banks:', error);
                            Alert.alert('Error', 'Failed to initialize banks. Please try again.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const loadBanks = async () => {
        try {
            setLoadingBanks(true);
            const fetchedBanks = await getBanks();
            setBanks(fetchedBanks);
        } catch (error) {
            console.error('Error loading banks:', error);
            Alert.alert('Error', 'Failed to load banks.');
        } finally {
            setLoadingBanks(false);
        }
    };

    React.useEffect(() => {
        // Auto-initialize banks if they don't exist
        const autoInitialize = async () => {
            try {
                const existingBanks = await getBanks();
                if (existingBanks.length === 0) {
                    console.log('No banks found, auto-initializing...');
                    setLoading(true);
                    const result = await initializePakistanBanks();
                    if (result.success) {
                        console.log(`✅ Auto-initialized ${result.count} banks`);
                        await loadBanks();
                    }
                    setLoading(false);
                } else {
                    loadBanks();
                }
            } catch (error) {
                console.error('Error auto-initializing banks:', error);
                setLoading(false);
                loadBanks(); // Still try to load banks even if initialization fails
            }
        };
        autoInitialize();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Initialize Banks</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    This utility will populate the Firestore 'banks' collection with dummy Pakistan bank details.
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleInitializeBanks}
                        disabled={loading}
                        style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Initialize Banks</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleForceInitialize}
                        disabled={loading}
                        style={[styles.button, styles.dangerButton, loading && styles.buttonDisabled]}
                    >
                        <Text style={styles.buttonText}>Force Re-initialize</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={loadBanks}
                        disabled={loadingBanks}
                        style={[styles.button, styles.secondaryButton, loadingBanks && styles.buttonDisabled]}
                    >
                        {loadingBanks ? (
                            <ActivityIndicator size="small" color="#8E6652" />
                        ) : (
                            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Refresh List</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.banksList}>
                    <Text style={styles.banksTitle}>
                        Current Banks ({banks.length})
                    </Text>
                    {loadingBanks ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8E6652" />
                        </View>
                    ) : banks.length === 0 ? (
                        <Text style={styles.noBanks}>No banks found. Click "Initialize Banks" to add banks.</Text>
                    ) : (
                        banks.map((bank, index) => (
                            <View key={bank.id || index} style={styles.bankItem}>
                                <View style={styles.bankHeader}>
                                    <Text style={styles.bankName}>{bank.name}</Text>
                                    <Text style={styles.bankCode}>{bank.code}</Text>
                                </View>
                                <Text style={styles.bankAccount}>Account: {bank.accountNumber}</Text>
                                <Text style={styles.bankTitle}>Title: {bank.accountTitle}</Text>
                                {bank.iban && (
                                    <Text style={styles.bankIban}>IBAN: {bank.iban}</Text>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#8E6652',
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
    },
    buttonContainer: {
        marginBottom: 30,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: '#8E6652',
    },
    dangerButton: {
        backgroundColor: '#dc3545',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#8E6652',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#8E6652',
    },
    banksList: {
        marginTop: 20,
    },
    banksTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    noBanks: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        padding: 20,
    },
    bankItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    bankHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    bankCode: {
        fontSize: 12,
        color: '#8E6652',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    bankAccount: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    bankTitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    bankIban: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        fontFamily: 'monospace',
    },
});

export default InitializeBanks;

