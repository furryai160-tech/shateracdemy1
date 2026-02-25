import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const [name, setName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!name || !studentPhone || !parentPhone) {
            Alert.alert('تنبيه', 'برجاء إدخال جميع البيانات المطلوبة');
            return;
        }

        // Ensure the name contains at least 2 words (first and last name)
        if (name.trim().split(' ').length < 2) {
            Alert.alert('تنبيه', 'يجب إدخال الاسم ثنائي أو ثلاثي');
            return;
        }

        setLoading(true);
        const res = await login(name.trim(), studentPhone.trim(), parentPhone.trim());
        setLoading(false);

        if (!res.success) {
            Alert.alert('خطأ', res.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.formContainer}>
                {/* We can place the provided logo here */}
                <Image
                    source={{ uri: 'https://i.ibb.co/3sksXZj/logo.png' }} // placeholder, assumes a valid logo URL or local import
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>تطبيق ولي الأمر</Text>
                <Text style={styles.subtitle}>أدخل بيانات الطالب للدخول لحسابه</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>اسم الطالب (ثنائي أو ثلاثي)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="مثال: أحمد محمد محمود"
                        value={name}
                        onChangeText={setName}
                        textAlign="right"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>رقم موبايل الطالب</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="مثال: 010xxxxxxxx"
                        value={studentPhone}
                        onChangeText={setStudentPhone}
                        keyboardType="phone-pad"
                        textAlign="right"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>رقم موبايل ولي الأمر</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="مثال: 010xxxxxxxx"
                        value={parentPhone}
                        onChangeText={setParentPhone}
                        keyboardType="phone-pad"
                        textAlign="right"
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 75,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1e3a8a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1e3a8a',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
