import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });

    await dbConnect();
    const profile = await UserProfile.findOne({ email: session.user.email });
    
    return NextResponse.json({ success: true, profile: profile || {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { email: session.user.email },
      { 
        email: session.user.email,
        fullName: body.fullName,
        phone: body.phone,
        address: body.address
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}