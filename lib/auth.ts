import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
        }
        
        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) {
          throw new Error("Không tìm thấy tài khoản này");
        }

        // 🚨 ĐÃ SỬA: Bật tính năng giải mã bcrypt và xóa cái kiểm tra mật khẩu thô đi
        const isPasswordMatch = await bcrypt.compare(credentials.password, (user as any).password);
        
        if (!isPasswordMatch) {
          throw new Error("Mật khẩu không chính xác");
        }

        // 👉 NẠP LUÔN ROLE TỪ ĐÂY, KHÔNG CẦN TÌM LẠI TRONG DB NỮA
        return {
          id: user._id.toString(),
          name: (user as any).fullName || (user as any).name,
          email: user.email,
          role: (user as any).role || 'user', // Mặc định nếu không có role thì là user
        };
      }
    }),
  ],
  callbacks: {
    // 1. Nạp role vào thẻ ID (token)
    async jwt({ token, user }) {
      if (user) {
        // Lấy thẳng role từ hàm authorize truyền sang, siêu nhanh!
        token.role = (user as any).role;
        token.id = user.id; 
      }
      return token;
    },
    // 2. Xuất role ra ngoài Session
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
};