import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { changePassword } from '../Helper/firebaseHelper';

const { width } = Dimensions.get('window');

const PasswordChange = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Error states
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const user = useSelector((state) => state.home.user);
    const dispatch = useDispatch();
    const nav = useNavigation();

    const validateForm = () => {
        let isValid = true;

        // Reset errors
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');

        // Validate current password
        if (!currentPassword.trim()) {
            setCurrentPasswordError('Current password is required');
            isValid = false;
        }

        // Validate new password
        if (!newPassword.trim()) {
            setNewPasswordError('New password is required');
            isValid = false;
        } else if (newPassword.length < 6) {
            setNewPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else if (newPassword === currentPassword) {
            setNewPasswordError('New password must be different from current password');
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Please confirm your new password');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }

        return isValid;
    };

    const handlePasswordChange = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            await changePassword(currentPassword, newPassword);

            Alert.alert(
                'Success',
                'Your password has been successfully changed!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            nav.goBack();
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error changing password:', error);

            if (error.code === 'auth/wrong-password') {
                setCurrentPasswordError('Current password is incorrect');
            } else if (error.code === 'auth/weak-password') {
                setNewPasswordError('Password is too weak');
            } else if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                    'Security Required',
                    'For security reasons, please log out and log back in before changing your password.',
                    [
                        { text: 'OK', onPress: () => nav.navigate('Logout') }
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to change password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
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
                    Change Password
                </Text>
            </View>

            {/* Content */}
            <View style={{ padding: 20, flex: 1 }}>
                {/* Info Card */}
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
                        backgroundColor: '#8E6652',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15,
                        alignSelf: 'center'
                    }}>
                        <Ionicons name="shield-checkmark-outline" size={30} color="#fff" />
                    </View>

                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#8E6652',
                        textAlign: 'center',
                        marginBottom: 10
                    }}>
                        Secure Your Account
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#666',
                        textAlign: 'center',
                        lineHeight: 20
                    }}>
                        Choose a strong password to keep your account secure
                    </Text>
                </View>

                {/* Password Fields */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 20,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                }}>
                    {/* Current Password */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#8E6652',
                            marginBottom: 8
                        }}>
                            Current Password
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: currentPasswordError ? '#E74C3C' : '#ddd',
                            borderRadius: 10,
                            backgroundColor: '#f9f9f9'
                        }}>
                            <TextInput
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPassword}
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    fontSize: 16,
                                    color: '#333'
                                }}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={{ padding: 10 }}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#8E6652"
                                />
                            </TouchableOpacity>
                        </View>
                        {currentPasswordError ? (
                            <Text style={{
                                fontSize: 12,
                                color: '#E74C3C',
                                marginTop: 5
                            }}>
                                {currentPasswordError}
                            </Text>
                        ) : null}
                    </View>

                    {/* New Password */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#8E6652',
                            marginBottom: 8
                        }}>
                            New Password
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: newPasswordError ? '#E74C3C' : '#ddd',
                            borderRadius: 10,
                            backgroundColor: '#f9f9f9'
                        }}>
                            <TextInput
                                placeholder="Enter new password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    fontSize: 16,
                                    color: '#333'
                                }}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={{ padding: 10 }}
                            >
                                <Ionicons
                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#8E6652"
                                />
                            </TouchableOpacity>
                        </View>
                        {newPasswordError ? (
                            <Text style={{
                                fontSize: 12,
                                color: '#E74C3C',
                                marginTop: 5
                            }}>
                                {newPasswordError}
                            </Text>
                        ) : null}
                        <Text style={{
                            fontSize: 12,
                            color: '#666',
                            marginTop: 5
                        }}>
                            Must be at least 6 characters long
                        </Text>
                    </View>

                    {/* Confirm Password */}
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#8E6652',
                            marginBottom: 8
                        }}>
                            Confirm New Password
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: confirmPasswordError ? '#E74C3C' : '#ddd',
                            borderRadius: 10,
                            backgroundColor: '#f9f9f9'
                        }}>
                            <TextInput
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                style={{
                                    flex: 1,
                                    padding: 15,
                                    fontSize: 16,
                                    color: '#333'
                                }}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ padding: 10 }}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#8E6652"
                                />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? (
                            <Text style={{
                                fontSize: 12,
                                color: '#E74C3C',
                                marginTop: 5
                            }}>
                                {confirmPasswordError}
                            </Text>
                        ) : null}
                    </View>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity
                    onPress={handlePasswordChange}
                    disabled={isLoading}
                    style={{
                        backgroundColor: isLoading ? '#ccc' : '#8E6652',
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
                            Change Password
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PasswordChange;
