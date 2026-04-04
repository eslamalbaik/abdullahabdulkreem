import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const DashboardContacts: React.FC = () => {
    const { data: contacts = [], isLoading, error } = useQuery<any[]>({
        queryKey: ['/api/admin/contacts'],
    });

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">جاري تحميل رسائل التواصل...</div>;
    if (error) return <div className="p-8 text-center text-red-500">حدث خطأ أثناء تحميل الرسائل</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">رسائل تواصل معنا</h1>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                {contacts && contacts.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">الاسم</TableHead>
                                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                <TableHead className="text-right">الموضوع</TableHead>
                                <TableHead className="text-right">الرسالة</TableHead>
                                <TableHead className="text-right">تاريخ الإرسال</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.map((contact: any) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell dir="ltr" className="text-right">{contact.email}</TableCell>
                                    <TableCell>{contact.projectType}</TableCell>
                                    <TableCell className="max-w-md truncate" title={contact.message}>
                                        {contact.message}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(contact.createdAt), "dd MMMM yyyy", { locale: ar })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        لا توجد رسائل تواصل حالياً.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardContacts;
