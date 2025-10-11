import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteUserAccount, reauthenticateUser } from '../Helper/firebaseHelper';
import { setUser, setRole } from '../redux/Slices/HomeDataSlice';

const { width, height } = Dimensions.get('window');

const Delete = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const user = useSelector((state) => state.home.user);
    const dispatch = useDispatch();
    const nav = useNavigation();

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Forever',
                    style: 'destructive',
                    onPress: () => {
                        // Second confirmation
                        Alert.alert(
                            'Final Confirmation',
                            'This is your last chance. Are you 100% sure you want to permanently delete your account?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Yes, Delete Forever',
                                    style: 'destructive',
                                    onPress: () => {
                                        setShowPasswordModal(true);
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const handlePasswordSubmit = async () => {
        if (!password.trim()) {
            setPasswordError('Please enter your password');
            return;
        }

        try {
            setIsLoading(true);
            setPasswordError('');

            // Re-authenticate user first
            await reauthenticateUser(user.email, password);

            // Delete the account
            await deleteUserAccount(user.uid);

            // Clear Redux state
            dispatch(setUser(null));
            dispatch(setRole(null));

            // Navigate to login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

            Alert.alert('Success', 'Your account has been permanently deleted.');

        } catch (error) {
            console.error('Error deleting account:', error);
            if (error.code === 'auth/wrong-password') {
                setPasswordError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/too-many-requests') {
                setPasswordError('Too many failed attempts. Please try again later.');
            } else {
                setPasswordError('Failed to delete account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowPasswordModal(false);
        setPassword('');
        setPasswordError('');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#8E6652',
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                marginBottom: 20
            }}>
                <TouchableOpacity
                    onPress={() => nav.goBack()}
                    style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#fff',
                    marginTop: 10
                }}>
                    Delete Account
                </Text>
            </View>

            {/* Content */}
            <View style={{ padding: 20, flex: 1 }}>
                {/* Warning Card */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 25,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#E74C3C',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15,
                        alignSelf: 'center'
                    }}>
                        <Ionicons name="trash-outline" size={30} color="#fff" />
                    </View>

                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#8E6652',
                        textAlign: 'center',
                        marginBottom: 15
                    }}>
                        Permanently Delete Account
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#666',
                        textAlign: 'center',
                        lineHeight: 20,
                        marginBottom: 20
                    }}>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </Text>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#8E6652', marginBottom: 10 }}>
                            What will be deleted:
                        </Text>
                        <View style={{ paddingLeft: 10 }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>• Your profile information</Text>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>• All your orders and history</Text>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>• Your saved preferences</Text>
                            <Text style={{ fontSize: 12, color: '#666' }}>• All associated data</Text>
                        </View>
                    </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                    onPress={handleDeleteAccount}
                    disabled={isLoading}
                    style={{
                        backgroundColor: '#E74C3C',
                        borderRadius: 25,
                        height: 55,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                    }}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{
                            fontSize: 18,
                            color: '#fff',
                            fontWeight: 'bold'
                        }}>
                            Delete Account Forever
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Password Confirmation Modal */}
            <Modal
                visible={showPasswordModal}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCancelDelete}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        padding: 20,
                        margin: 20,
                        width: width * 0.9,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#8E6652',
                            textAlign: 'center',
                            marginBottom: 15
                        }}>
                            Confirm Password
                        </Text>

                        <Text style={{
                            fontSize: 14,
                            color: '#666',
                            textAlign: 'center',
                            marginBottom: 20
                        }}>
                            Please enter your password to confirm account deletion
                        </Text>

                        <TextInput
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError('');
                            }}
                            secureTextEntry
                            style={{
                                borderWidth: 1,
                                borderColor: passwordError ? '#E74C3C' : '#ddd',
                                borderRadius: 10,
                                padding: 15,
                                fontSize: 16,
                                marginBottom: 10
                            }}
                            placeholderTextColor="#999"
                        />

                        {passwordError ? (
                            <Text style={{
                                fontSize: 12,
                                color: '#E74C3C',
                                marginBottom: 15,
                                textAlign: 'center'
                            }}>
                                {passwordError}
                            </Text>
                        ) : null}

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 10
                        }}>
                            <TouchableOpacity
                                onPress={handleCancelDelete}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#95A5A6',
                                    borderRadius: 20,
                                    height: 45,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: '#fff',
                                    fontWeight: '600'
                                }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handlePasswordSubmit}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#E74C3C',
                                    borderRadius: 20,
                                    height: 45,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#fff',
                                        fontWeight: '600'
                                    }}>
                                        Delete Account
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Delete;
