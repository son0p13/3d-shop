'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface StlPreviewProps {
  geometry: THREE.BufferGeometry | null;
}

export default function StlPreview({ geometry }: StlPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !geometry) return;

    const container = containerRef.current;
    
    // 🌟 1. THIẾT LẬP CƠ BẢN: Cảnh, Camera, Bộ render
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f9fafb'); // Màu nền xám cực nhẹ (gray-50)

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 100); // Đặt camera ở xa để nhìn tổng thể

    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Bật khử răng cưa cho nét
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Xóa bộ render cũ nếu có (tránh bị lặp hình)
    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 🌟 2. ÁNH SÁNG: Cho mô hình có khối
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5); // Ánh sáng môi trường
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8); // Ánh sáng chiếu tới
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 🌟 3. MÔ HÌNH: Dựng file từ geometry
    // Sử dụng chất liệu mặc định có độ bóng nhẹ (MeshPhongMaterial)
    const material = new THREE.MeshPhongMaterial({ 
      color: '#2563EB', // Màu xanh MixiMix (blue-600)
      specular: '#111111', 
      shininess: 30,
      flatShading: true // Cho mô hình STL nhìn rõ các mặt cắt (lưới)
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Tự động căn giữa mô hình và thu phóng camera cho vừa
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    if (boundingBox) {
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      mesh.position.sub(center); // Căn giữa mô hình

      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.z = maxDim * 2.5; // Điều chỉnh khoảng cách camera dựa trên kích thước
    }

    scene.add(mesh);

    // 🌟 4. ĐIỀU KHIỂN: Cho phép xoay, thu phóng bằng chuột
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Cho cảm giác xoay mượt mà hơn
    controls.dampingFactor = 0.1;

    // 🌟 5. VÒNG LẶP HOẠT ẢNH: Render liên tục
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Cập nhật bộ điều khiển
      renderer.render(scene, camera);
    };
    animate();

    // 🌟 6. XỬ LÝ KHI ĐỔI KÍCH THƯỚC: Web co giãn thì hình cũng co giãn theo
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // HÀM DỌN DẸP: Khi component bị ẩn thì tắt các bộ render để đỡ tốn RAM
    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [geometry]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden group relative"
    >
        {/* Nút hướng dẫn ẩn */}
        <div className="absolute bottom-3 right-3 bg-white/70 text-gray-500 text-xs px-2 py-1 rounded font-medium opacity-0 group-hover:opacity-100 transition">
            Dùng chuột để Xoay / Thu phóng
        </div>
    </div>
  );
}