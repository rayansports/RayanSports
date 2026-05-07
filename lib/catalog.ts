import { collection, query, getDocs, where } from 'firebase/firestore/lite';
import { liteDb as db } from './firebase';

export interface Article {
  articleNumber: string;
  name: string;
  image: string;
  color: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
  articles?: Article[];
  price?: number;
  sku?: string;
  isActive?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  products?: Product[];
}

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, 'categories'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const q = query(collection(db, 'categories'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const categoryDoc = snapshot.docs[0];
      const category = { id: categoryDoc.id, ...categoryDoc.data() } as Category;
      
      const pQ = query(collection(db, 'products'), where('categoryId', '==', category.id));
      const pSnapshot = await getDocs(pQ);
      category.products = pSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      
      return category;
    }
  } catch (error) {
    console.error("Error fetching category", error);
  }
  return null;
}

export async function getProductBySlug(categorySlug: string, productSlug: string): Promise<Product | null> {
  try {
    const q = query(collection(db, 'products'), where('slug', '==', productSlug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
    }
  } catch (error) {
    console.error("Error fetching product", error);
  }
  return null;
}
