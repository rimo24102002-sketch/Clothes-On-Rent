import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getSellerNotificationSettings, updateSellerNotificationSettings } from "../Helper/firebaseHelper";

export default function NotificationSettings({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    orders: true,
    payments: true,
    reviews: true,
    reminders: true
  });

  useEffect(() => {
    loadNotificationSettings();
  }, [sellerId]);

  const loadNotificationSettings = async () => {
    try {
      if (!sellerId) return;
      const data = await getSellerNotificationSettings(sellerId);
      setSettings(data);
    } catch (error) {
      console.error("Error loading notification settings:", error);
      Alert.alert("Loading Error", "Unable to load your seller notification settings. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (category, value) => {
    try {
      setSaving(true);
      const newSettings = {
        ...settings,
        [category]: value
      };
      
      setSettings(newSettings);
      await updateSellerNotificationSettings(sellerId, newSettings);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      Alert.alert("Save Failed", "Could not update your seller notification settings. Please ensure you have a stable internet connection and try again.");
      // Revert the change on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  // Custom Switch Component with CSS-like styling
  const CustomSwitch = ({ value, onValueChange, disabled }) => {
    const switchStyles = {
      container: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F1DCD1',
        padding: 2,
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      },
      thumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: value ? '#8E6652' : '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        transform: [{ translateX: value ? 18 : 0 }],
      },
    };

    return (
      <TouchableOpacity
        style={switchStyles.container}
        onPress={() => !disabled && onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={switchStyles.thumb} />
      </TouchableOpacity>
    );
  };

  const NotificationRow = ({ title, description, category, iconName }) => (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Feather name={iconName} size={20} color="#8E6652" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{title}</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{description}</Text>
          </View>
        </View>
        <CustomSwitch
          value={settings[category] || false}
          onValueChange={(value) => updateSetting(category, value)}
          disabled={saving}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#8E6652', marginLeft: 12 }}>Notification Settings</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading seller notification settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#8E6652', marginLeft: 12 }}>Notification Settings</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Header Text */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
            Control notifications you receive from customers. Turn on/off alerts for new orders, payment confirmations, customer reviews, and important reminders.
          </Text>
        </View>

        {/* Orders */}
        <NotificationRow
          title="Customer Orders"
          description="Get notified when customers place new orders, cancel orders, or request updates"
          category="orders"
          iconName="shopping-bag"
        />

        {/* Payments */}
        <NotificationRow
          title="Payment Alerts"
          description="Receive alerts for COD payments, payment confirmations, and earning updates"
          category="payments"
          iconName="credit-card"
        />

        {/* Reviews */}
        <NotificationRow
          title="Customer Reviews"
          description="Get notified when customers leave reviews, ratings, or feedback on your items"
          category="reviews"
          iconName="star"
        />

        {/* Reminders */}
        <NotificationRow
          title="Important Reminders"
          description="Reminders for item pickup, return deadlines, and customer communication"
          category="reminders"
          iconName="clock"
        />

        {/* Save Status */}
        {saving && (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color="#8E6652" />
            <Text style={{ marginLeft: 12, color: '#8E6652', fontSize: 14 }}>Updating notification settings...</Text>
          </View>
        )}

        {/* Footer Info */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 30, borderWidth: 1, borderColor: '#E0E0E0' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Feather name="info" size={16} color="#8E6652" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#8E6652', marginLeft: 8 }}>Important</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#666', lineHeight: 18 }}>
            • Critical seller alerts (account security, policy changes) will always be sent{'\n'}
            • Settings are automatically saved when you toggle notifications on/off{'\n'}
            • You can change these preferences anytime from your account settings{'\n'}
            • Turning off notifications may delay your response to customers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
