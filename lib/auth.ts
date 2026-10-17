import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function getUser(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  
  await connectDB();

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
}
