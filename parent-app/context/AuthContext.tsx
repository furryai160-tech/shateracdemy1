import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserData = {
    id: string;
    name: string;
    phone: string;
    parentPhone: string;
    role: string;
    walletBalance: number;
};

type AuthContextType = {
    user: UserData | null;
    login: (name: string, studentPhone: string, parentPhone: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => ({ success: false }),
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('parentAppUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (name: string, studentPhone: string, parentPhone: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('User')
                .select('*')
                .eq('phone', studentPhone)
                .eq('parentPhone', parentPhone)
                .eq('role', 'STUDENT')
                .maybeSingle();

            if (error) {
                return { success: false, message: 'بيانات غير صحيحة، تأكد من إدخال الاسم ورقم الهاتف بشكل صحيح' };
            }

            if (data) {
                // Verify that the first name or part of the name matches to ensure security
                const dbNameWords = data.name ? data.name.trim().split(' ') : [];
                const inputNameWords = name.trim().split(' ');

                // At least one word from the DB name should match the input name string (case insensitive)
                const isNameMatching = dbNameWords.length > 0 ? inputNameWords.some(word => data.name.includes(word)) : true;

                if (!isNameMatching) {
                    return { success: false, message: 'الاسم المدخل لا يطابق الاسم المسجل لرقم الهاتف' };
                }

                setUser(data);
                await AsyncStorage.setItem('parentAppUser', JSON.stringify(data));
                return { success: true };
            }
            return { success: false, message: 'لم يتم العثور على طالب بهذه البيانات أو لم يتم إدخال رقم هاتف ولي الأمر للطالب عند تسجيله' };
        } catch (err: any) {
            return { success: false, message: err?.message || 'حدث خطأ' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('parentAppUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
