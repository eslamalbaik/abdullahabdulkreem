import { db } from "../server/db";
import { products } from "../shared/schema";

async function seedProducts() {
    console.log("⏳ جاري إضافة المنتجات...");

    const sampleProducts = [
        {
            title: "تصميم شعار احترافي",
            category: "تصميم",
            price: 500,
            image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
            description: "تصميم شعار احترافي يعكس هوية علامتك التجارية بأسلوب عصري وفريد. يشمل ٣ مقترحات مختلفة مع تعديلات غير محدودة حتى الوصول للنتيجة المثالية.",
            featured: true,
        },
        {
            title: "هوية بصرية متكاملة",
            category: "هوية بصرية",
            price: 2500,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
            description: "باقة هوية بصرية متكاملة تشمل الشعار، الألوان، الخطوط، بطاقات العمل، الأوراق الرسمية، وملف دليل الهوية البصرية الشامل.",
            featured: true,
        },
        {
            title: "تصميم بطاقة أعمال",
            category: "طباعة",
            price: 150,
            image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
            description: "تصميم بطاقة أعمال أنيقة ومميزة بوجهين مع ملف جاهز للطباعة بجودة عالية.",
            featured: false,
        },
        {
            title: "تصميم سوشيال ميديا",
            category: "تصميم",
            price: 300,
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
            description: "حزمة تصاميم سوشيال ميديا تشمل ١٠ بوستات مع قوالب قابلة للتعديل لمنصات التواصل الاجتماعي المختلفة.",
            featured: true,
        },
    ];

    for (const product of sampleProducts) {
        const [created] = await db.insert(products).values(product).returning();
        console.log(`✅ تم إضافة: ${created.title} (ID: ${created.id})`);
    }

    console.log("\n🎉 تم إضافة جميع المنتجات بنجاح!");
    process.exit(0);
}

seedProducts().catch((err) => {
    console.error("❌ خطأ:", err);
    process.exit(1);
});
