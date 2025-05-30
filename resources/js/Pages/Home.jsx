import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MusicWaveEffect = ({ isPlaying, audioData = [] }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 35;
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 300;
      
      for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        particlesRef.current.push({
          phi,
          theta,
          x: 0,
          y: 0,
          z: 0,
          originalRadius: baseRadius,
          opacity: 0.5 + Math.random() * 0.5,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.025;
      
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const audioIntensity = audioData.length > 0 
        ? audioData.reduce((sum, val) => sum + val, 0) / audioData.length / 255
        : Math.sin(timeRef.current * 2) * 0.5 + 0.5;
      
      particlesRef.current.forEach((particle) => {
        const waveEffect = Math.sin(timeRef.current * 3 + particle.pulseOffset) * audioIntensity * 12;
        const currentRadius = particle.originalRadius + waveEffect;
        
        particle.x = currentRadius * Math.sin(particle.phi) * Math.cos(particle.theta);
        particle.y = currentRadius * Math.sin(particle.phi) * Math.sin(particle.theta);
        particle.z = currentRadius * Math.cos(particle.phi);
        
        const scale = 180 / (180 + particle.z);
        const x2d = centerX + particle.x * scale;
        const y2d = centerY + particle.y * scale;
        const hue = (particle.theta * 180 / Math.PI + timeRef.current * 40) % 360;
        const saturation = 65 + audioIntensity * 25;
        const lightness = 45 + audioIntensity * 25;
        const depthOpacity = (particle.z + currentRadius) / (currentRadius * 2);
        const finalOpacity = particle.opacity * depthOpacity * (0.4 + audioIntensity * 0.6);
        
        ctx.beginPath();
        const size = (0.7 + audioIntensity * 1.2) * scale;
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalOpacity})`;
        ctx.fill();
        
       
        ctx.shadowBlur = 6 + audioIntensity * 10;
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      const coreRadius = 6 + audioIntensity * 15;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
      gradient.addColorStop(0, `rgba(100, 200, 255, ${0.7 * audioIntensity})`);
      gradient.addColorStop(0.5, `rgba(50, 150, 255, ${0.3 * audioIntensity})`);
      gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    initParticles();
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, audioData]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="absolute inset-0 pointer-events-none"
      style={{ filter: 'blur(0.3px)' }}
    />
  );
};

const shapes = [
    'rounded-full', 
    '', 
    'rounded-lg', 
    'clip-triangle',
    'clip-hexagon', 
    'rounded-md', 
];

const skills = [
    {
        name: 'HTML5',
        icon: <i className="fab fa-html5 text-6xl text-orange-600 mb-3"></i>,
        music: '/music/tg1.m4a',
        bgIcon: <img src="https://cdn-icons-png.flaticon.com/512/919/919827.png" className="w-72 h-72 opacity-20" alt="HTML5" />,
    },
    {
        name: 'CSS3',
        icon: <i className="fab fa-css3-alt text-6xl text-blue-600 mb-3"></i>,
        music: '/music/tg2.m4a',
        bgIcon: <img src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/css3-512.png" className="w-72 h-72 opacity-20" alt="CSS3" />,
    },
    {
        name: 'JavaScript',
        icon: <i className="fab fa-js-square text-6xl text-yellow-400 mb-3"></i>,
        music: '/music/tg3.mp3',
        bgIcon: <img src="https://www.clipartmax.com/png/middle/470-4707396_javascript-icon-html-css-js-icons.png" className="w-72 h-72 opacity-20" alt="JavaScript" />,
    },
    {
        name: 'React',
        icon: <i className="fab fa-react text-6xl text-cyan-500 mb-3"></i>,
        music: '/music/tg4.mp3',
        bgIcon: <img src="https://th.bing.com/th/id/OIP.9485Ti-M1KbzT9K4ZShMdAHaHO?rs=1&pid=ImgDetMain" className="w-72 h-72 opacity-20" alt="React" />,
    },
    {
        name: 'Laravel',
        icon: <img src="https://logospng.org/download/laravel/logo-laravel-icon-1024.png" className="w-16 h-16 mb-3" alt="Laravel" />,
        music: '/music/tg5.m4a',
        bgIcon: <img src="https://logospng.org/download/laravel/logo-laravel-icon-1024.png" className="w-72 h-72 opacity-20" alt="Laravel" />,
    },
    {
        name: 'PHP',
        icon: <img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3259795/php-icon-md.png" className="w-16 h-16 mb-3" alt="PHP" />,
        music: '/music/tg6.mp3',
        bgIcon: <img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3259795/php-icon-md.png" className="w-72 h-72 opacity-20" alt="PHP" />,
    },
    {
        name: 'Git',
        icon: <i className="fab fa-git-alt text-6xl text-red-600 mb-3"></i>,
        music: '/music/tg7.mp3',
        bgIcon: <img src="https://th.bing.com/th/id/OIP.lhH2AodxozEbYxSDLz8BUAHaEK?rs=1&pid=ImgDetMain" className="w-100 h-72 opacity-20" alt="Git" />,
    },
    {
        name: 'MySQL',
        icon: <img src="https://th.bing.com/th/id/OIP.63jNc3AqvI3loUog55YBhwHaHa?rs=1&pid=ImgDetMain" className="w-16 h-16 mb-3" alt="MySQL" />,
        music: '/music/tg8.mp3',
        bgIcon: <img src="https://th.bing.com/th/id/OIP.63jNc3AqvI3loUog55YBhwHaHa?rs=1&pid=ImgDetMain" className="w-72 h-72 opacity-20" alt="MySQL" />,
    },
    {
        name: 'Github',
        icon: <img src="https://logowik.com/content/uploads/images/github9775.jpg" className="w-16 h-12 mb-3" alt="Github" />,
        music: '/music/tg9.mp3',
        bgIcon: <img src="https://logowik.com/content/uploads/images/github9775.jpg" className="w-72 h-56 opacity-20" alt="Github" />,
    },
    {
        name: 'Bootstrap',
        icon: <img src="https://th.bing.com/th/id/OIP.KTq5K5E3QeLVrm71FR0w8gHaHa?rs=1&pid=ImgDetMain" className="w-16 h-16 mb-3" alt="Bootstrap" />,
        music: '/music/tg10.mp3',
        bgIcon: <img src="https://www.pinclipart.com/picdir/middle/35-353932_bootstrap-bootstrap-4-logo-png-clipart.png" className="w-72 h-72 opacity-20" alt="Bootstrap" />,
    },
    {
        name: 'Tailwind',
        icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1024px-Tailwind_CSS_Logo.svg.png?20230715030042" className="w-16 h-12 mb-3" alt="Tailwind" />,
        music: '/music/tg11.mp3',
        bgIcon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1024px-Tailwind_CSS_Logo.svg.png?20230715030042" className="w-72 h-56 opacity-20" alt="Tailwind" />,
    },
];

const projects = [
  {
    name: "bán thuốc và đặt lịch khám",
    img: "https://storage.googleapis.com/a1aa/image/f6d45e29-ad16-4beb-36d5-17cffe72ede0.jpg",
    desc: "Tích hợp chức năng bán thuốc trực tuyến và đặt lịch khám bệnh. Dự án này bao gồm việc phát triển giao diện người dùng thân thiện cho phép tìm kiếm, xem thông tin chi tiết sản phẩm, quản lý đơn hàng, đặt lịch hẹn và tương tác với bộ phận hỗ trợ. Đồng thời, xây dựng hệ thống quản lý phía sau cho phép quản lý sản phẩm, đơn hàng và lịch hẹn hiệu quả.",
    github: "https://github.com/thangpo/BE-DATN-WD930.git",
    timeline: [
      {
        title: "Bắt đầu",
        time: "01/01/2024",
        end: "15/01/2024",
        work: "Phân tích yêu cầu, thiết kế giao diện, chuẩn bị dữ liệu sản phẩm."
      },
      {
        title: "Hoàn thiện",
        time: "16/01/2024",
        end: "28/01/2024",
        work: "Phát triển chức năng giỏ hàng, thanh toán, quản lý đơn hàng."
      },
      {
        title: "Kết thúc",
        time: "29/01/2024",
        end: "31/01/2024",
        work: "Kiểm thử, tối ưu hiệu suất, triển khai lên server."
      }
    ]
  },
  {
    name: "Quản lý nhóm nhạc",
    img: "https://storage.googleapis.com/a1aa/image/b4efd365-edf0-4201-e020-5615141517bd.jpg",
    desc: "Hệ thống quản lý nhóm nhạc hiệu quả, hỗ trợ quản lý thành viên, nội dung, lịch trình, và tương tác trực tiếp với người hâm mộ qua vé, live, và nhắn tin. Hệ thống quản lý nhóm nhạc được thiết kế để giải quyết những thách thức đặc thù mà các nhóm nhạc hiện đại phải đối mặt, từ tổ chức nội bộ đến tương tác với công chúng. Mục tiêu là tạo ra một nền tảng liền mạch, giúp nhóm nhạc tập trung vào sáng tạo và biểu diễn.",
    github: "https://github.com/thangpo/task-manager-demo",
    timeline: [
      {
        title: "Bắt đầu",
        time: "01/01/2024",
        end: "15/01/2024",
        work: "Phân tích yêu cầu, thiết kế giao diện, chuẩn bị dữ liệu sản phẩm."
      },
      {
        title: "Hoàn thiện",
        time: "16/01/2024",
        end: "28/01/2024",
        work: "Phát triển chức năng giỏ hàng, thanh toán, quản lý đơn hàng."
      },
      {
        title: "Kết thúc",
        time: "29/01/2024",
        end: "31/01/2024",
        work: "Kiểm thử, tối ưu hiệu suất, triển khai lên server."
      }
    ]
  },
  {
    name: "Bán sách",
    img: "https://storage.googleapis.com/a1aa/image/11a3e2bb-be65-4054-cb24-4a29a2400a79.jpg",
    desc: "Mục tiêu: Xây dựng hệ thống quản lý bán sách trực tuyến với giao diện admin và người dùng, hỗ trợ CRUD, thống kê, và các tính năng thương mại điện tử. Hệ thống bán sách trực tuyến toàn diện, hỗ trợ quản lý sách, đơn hàng, tài khoản, đánh giá, và tin tức, với giao diện admin mạnh mẽ và trải nghiệm người dùng tiện lợi.",
    github: "https://github.com/thangpo/blog-demo",
    timeline: [
      {
        title: "Bắt đầu",
        time: "01/01/2024",
        end: "15/01/2024",
        work: "Phân tích yêu cầu, thiết kế giao diện, chuẩn bị dữ liệu sản phẩm."
      },
      {
        title: "Hoàn thiện",
        time: "16/01/2024",
        end: "28/01/2024",
        work: "Phát triển chức năng giỏ hàng, thanh toán, quản lý đơn hàng."
      },
      {
        title: "Kết thúc",
        time: "29/01/2024",
        end: "31/01/2024",
        work: "Kiểm thử, tối ưu hiệu suất, triển khai lên server."
      }
    ]
  },
  {
    name: "Thương mại điện tử",
    img: "https://storage.googleapis.com/a1aa/image/11a3e2bb-be65-4054-cb24-4a29a2400a79.jpg",
    desc: "Thương Mại Điện Tử Giày Dép: Kết Nối Đam Mê và Phong Cách. Hệ thống này không chỉ đơn thuần là nơi mua bán, mà còn là một không gian tương tác, kết nối những người đam mê giày, từ người bán chuyên nghiệp đến những sneakerhead đích thực. Trải Nghiệm Mua Sắm Cá Nhân Hóa và Tương Tác Cộng Đồng",
    github: "https://github.com/thangpo/bangiay.git",
    timeline: [
      {
        title: "Bắt đầu",
        time: "01/01/2024",
        end: "15/01/2024",
        work: "Phân tích yêu cầu, thiết kế giao diện, chuẩn bị dữ liệu sản phẩm."
      },
      {
        title: "Hoàn thiện",
        time: "16/01/2024",
        end: "28/01/2024",
        work: "Phát triển chức năng giỏ hàng, thanh toán, quản lý đơn hàng."
      },
      {
        title: "Kết thúc",
        time: "29/01/2024",
        end: "31/01/2024",
        work: "Kiểm thử, tối ưu hiệu suất, triển khai lên server."
      }
    ]
  },
  {
    name: "Bán thuốc và quản lý kho",
    img: "https://storage.googleapis.com/a1aa/image/11a3e2bb-be65-4054-cb24-4a29a2400a79.jpg",
    desc: "Ý tưởng về một hệ thống toàn diện áp dụng vào lĩnh vực bán thuốc và quản lý kho dược phẩm sẽ tạo ra một nền tảng chuyên biệt, không chỉ giúp các nhà thuốc, quầy thuốc hoạt động hiệu quả hơn mà còn đảm bảo chất lượng, an toàn và truy xuất nguồn gốc sản phẩm. Đây là một hệ thống thiết yếu để hiện đại hóa ngành dược, nâng cao dịch vụ chăm sóc sức khỏe cộng đồng.",
    github: "https://github.com/thangpo/BE-DATN-SP25.git",
    timeline: [
      {
        title: "Bắt đầu",
        time: "01/01/2024",
        end: "15/01/2024",
        work: "Phân tích yêu cầu, thiết kế giao diện, chuẩn bị dữ liệu sản phẩm."
      },
      {
        title: "Hoàn thiện",
        time: "16/01/2024",
        end: "28/01/2024",
        work: "Phát triển chức năng giỏ hàng, thanh toán, quản lý đơn hàng."
      },
      {
        title: "Kết thúc",
        time: "29/01/2024",
        end: "31/01/2024",
        work: "Kiểm thử, tối ưu hiệu suất, triển khai lên server."
      }
    ]
  },
   {
    name: "Blog các nhân",
    img: "https://storage.googleapis.com/a1aa/image/11a3e2bb-be65-4054-cb24-4a29a2400a79.jpg",
    desc: "Trên blog này, mình sẽ ghi lại những gì mình đã học được, những kinh nghiệm quý báu và cả những bài học xương máu trong quá trình thực tập Dự án cá nhân: Mình sẽ chia sẻ về các dự án nhỏ mình đã tự xây dựng, từ ý tưởng ban đầu đến sản phẩm hoàn chỉnh Những suy nghĩ và cảm nhận: Đôi khi, mình cũng sẽ tâm sự về những cảm xúc, khó khăn và động lực trong quá trình học tập và làm việc",
    github: "https://github.com/thangpo/blog-demo",
    timeline: [
      {
        title: "Bắt đầu",
        time: "01/01/2024",
        end: "15/01/2024",
        work: "Phân tích yêu cầu, thiết kế giao diện, chuẩn bị dữ liệu sản phẩm."
      },
      {
        title: "Hoàn thiện",
        time: "16/01/2024",
        end: "28/01/2024",
        work: "Phát triển chức năng giỏ hàng, thanh toán, quản lý đơn hàng."
      },
      {
        title: "Kết thúc",
        time: "29/01/2024",
        end: "31/01/2024",
        work: "Kiểm thử, tối ưu hiệu suất, triển khai lên server."
      }
    ]
  }
];

function Home() {

    const [shapeIndex, setShapeIndex] = useState(0);
    const [showIntro, setShowIntro] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [playingIndex, setPlayingIndex] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [expandedProject, setExpandedProject] = useState(null);
    const [audioData, setAudioData] = useState([]);
    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const rafIdRef = useRef(null);

    useEffect(() => {
        setTimeout(() => setShowIntro(true), 800);

        const interval = setInterval(() => {
            setShapeIndex((prev) => (prev + 1) % shapes.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    const handleSkillClick = (idx) => {
        if (playingIndex === idx) {
            setPlayingIndex(null);
        } else {
            setPlayingIndex(idx);
        }
    };

    useEffect(() => {
        if (playingIndex !== null && audioRef.current) {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioCtxRef.current.createAnalyser();
                sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioCtxRef.current.destination);
                analyserRef.current.fftSize = 64;
            }
            const analyser = analyserRef.current;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const animate = () => {
                analyser.getByteFrequencyData(dataArray);
                setAudioData([...dataArray]);
                rafIdRef.current = requestAnimationFrame(animate);
            };
            animate();
        } else {
            setAudioData([]);
        }

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [playingIndex]);

    useEffect(() => {
        if (playingIndex !== null && audioRef.current) {
            audioRef.current.src = skills[playingIndex].music;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => {
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [playingIndex]);

    return (
        <>
        <div className="min-h-screen bg-gray-50">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            
            {playingIndex !== null && (
                <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center">
                    {skills[playingIndex].bgIcon}
                </div>
            )}
            
            <header className="relative z-10 shadow-md sticky top-0 z-50 bg-white">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">
                        Nguyễn Giang Thắng
                    </h1>
                    {/* Desktop menu */}
                    <nav className="hidden md:flex">
                        <ul className="flex space-x-6 text-gray-700 font-medium">
                            <li>
                                <a className="hover:text-indigo-600 transition" href="#about">Giới thiệu</a>
                            </li>
                            <li>
                                <a className="hover:text-indigo-600 transition" href="#skills">Kỹ năng</a>
                            </li>
                            <li>
                                <a className="hover:text-indigo-600 transition" href="#projects">Dự án</a>
                            </li>
                            <li>
                                <a className="hover:text-indigo-600 transition" href="#contact">Liên hệ</a>
                            </li>
                        </ul>
                    </nav>
                    {/* Hamburger icon for mobile */}
                    <button
                        className="md:hidden text-3xl text-indigo-600 focus:outline-none"
                        onClick={() => setShowMenu(true)}
                        aria-label="Mở menu"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
                {/* Mobile menu overlay */}
                {showMenu && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end md:hidden">
                        <div className="bg-white w-64 h-full shadow-lg p-6 relative animate-slideInRight">
                            <button
                                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
                                onClick={() => setShowMenu(false)}
                                aria-label="Đóng menu"
                            >
                                &times;
                            </button>
                            <ul className="flex flex-col space-y-6 mt-12 text-gray-700 font-medium">
                                <li>
                                    <a href="#about" onClick={() => setShowMenu(false)} className="hover:text-indigo-600 transition">Giới thiệu</a>
                                </li>
                                <li>
                                    <a href="#skills" onClick={() => setShowMenu(false)} className="hover:text-indigo-600 transition">Kỹ năng</a>
                                </li>
                                <li>
                                    <a href="#projects" onClick={() => setShowMenu(false)} className="hover:text-indigo-600 transition">Dự án</a>
                                </li>
                                <li>
                                    <a href="#contact" onClick={() => setShowMenu(false)} className="hover:text-indigo-600 transition">Liên hệ</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
                <style>
                    {`
                    @keyframes slideInRight {
                        from { transform: translateX(100%);}
                        to { transform: translateX(0);}
                    }
                    .animate-slideInRight {
                        animation: slideInRight 0.3s ease;
                    }
                    `}
                </style>
            </header>
            
            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                <section className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-20" id="about">
                    <div
                        className={`flex-shrink-0 w-48 h-48 overflow-hidden shadow-lg transition-all duration-700 ease-in-out
                            ${shapes[shapeIndex]}
                            ${shapeIndex === 3 ? 'clip-triangle' : ''}
                            ${shapeIndex === 4 ? 'clip-hexagon' : ''}
                        `}
                        style={{
                            background: '#fff',
                        }}
                    >
                         <img
                            alt="Ảnh chân dung của một người đàn ông Việt Nam trẻ tuổi, mặc áo sơ mi trắng, cười tươi, nền màu sáng"
                            className={`w-full h-full object-cover transition-all duration-700
                                ${shapeIndex === 3 || shapeIndex === 4
                                    ? ''
                                    : ''}
                            `}
                            height="300"
                            src="/anh3.4.jpg"
                            width="300"
                        />
                    </div>
                
                    <div
                        className={`max-w-xl text-center md:text-left transition-all duration-700
                            ${showIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}
                    >
                        <h2 className="text-4xl font-extrabold text-indigo-600 mb-4">
                            Xin chào, tôi là Nguyễn Giang Thắng
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700">
                           Tôi là một người đam mê công nghệ, đặc biệt quan tâm đến các khía cạnh phía sau của ứng dụng web. Với kiến thức nền tảng về lập trình web và sự tò mò khám phá thế giới backend, 
                           tôi mong muốn được học hỏi và đóng góp vào việc xây dựng các hệ thống mạnh mẽ và hiệu quả. 
                           Trong tương lai, tôi hướng tới mục tiêu trở thành một Fullstack Developer, 
                           có khả năng xây dựng toàn diện các ứng dụng web. Tôi tin rằng với sự nhiệt huyết và tinh thần học hỏi nhanh, 
                           tôi sẽ nhanh chóng làm quen và phát triển trong vai trò thực tập sinh backend, 
                           đây sẽ là một bước đệm quan trọng trên con đường trở thành một Fullstack chuyên nghiệp.
                        </p>

                        <div className="flex justify-center md:justify-start gap-6 mt-4">
                            <a
                                href="https://www.facebook.com/share/191BtN47Hr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-3xl transition"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-square"></i>
                            </a>
                            <a
                                href="https://github.com/thangpo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-black text-3xl transition"
                                aria-label="GitHub"
                            >
                                <i className="fab fa-github"></i>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/th%E1%BA%AFng-nguy%E1%BB%85n-6395a6354?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-900 text-3xl transition"
                                aria-label="LinkedIn"
                            >
                                <i className="fab fa-linkedin"></i>
                            </a>
                            <a
                                href="#"
                                onClick={e => { e.preventDefault(); setShowQR(true); }}
                                className="text-blue-700 hover:text-blue-900 text-3xl transition"
                            >
                                <img
                                    src="https://th.bing.com/th/id/OIP.xW2F3TvZmbupU73ecvsm-QHaHB?cb=iwc2&rs=1&pid=ImgDetMain"
                                    alt="Zalo Icon"
                                    style={{ width: '28px', height: '28px', marginTop: '3px' }}
                                />
                            </a>
                            {showQR && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                    <div
                                        className="bg-white rounded-lg shadow-lg p-6 relative
                                            transition-all duration-500 ease-out
                                            transform scale-90 opacity-0 animate-showQR"
                                        style={{ animation: 'showQR 0.4s forwards' }}
                                    >
                                        <button
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                                            onClick={() => setShowQR(false)}
                                            aria-label="Đóng"
                                        >
                                            &times;
                                        </button>
                                        <img
                                            src="/zalo.jpg"
                                            alt="QR Zalo"
                                            className="w-64 h-64 object-contain"
                                        />
                                        <div className="text-center mt-2 text-gray-700 font-semibold">
                                            Quét mã QR để kết bạn Zalo
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
               

                <section className="mb-20" id="skills">
                    <h3 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
                        Kỹ năng của tôi
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {skills.map((skill, idx) => (
                            <div
                                key={skill.name}
                                className="flex flex-col items-center cursor-pointer group relative"
                                onClick={() => handleSkillClick(idx)}
                            >
                                <div className="relative">
                                    {skill.icon}
                                    
                                    {playingIndex === idx && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                                            <MusicWaveEffect 
                                                isPlaying={true} 
                                                audioData={audioData}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <span className={`text-lg font-semibold transition ${
                                    playingIndex === idx ? 'text-indigo-600' : 'text-gray-800 group-hover:text-indigo-600'
                                }`}>
                                    {skill.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <audio ref={audioRef} />
                    <div className="text-center mt-12 text-gray-600">
                        <p>🎵 Click vào bất kỳ skill nào để xem hiệu ứng 3D music wave</p>
                    </div>
                </section>

               
                <section className="mb-20" id="projects">
                    <h3 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
                        Một số dự án tiêu biểu
                    </h3>
                    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
                        {projects.map((project, idx) => (
                            <article
                                key={project.name}
                                className="flip-card min-h-[380px] relative"
                                onClick={() => setSelectedProject(selectedProject === idx ? null : idx)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className={`flip-card-inner ${selectedProject === idx ? 'flipped' : ''} h-full`}>
                                {/* Mặt trước */}
                                <div className="flip-card-front bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                                    <img
                                    alt={project.desc}
                                    className="w-full h-48 object-cover"
                                    height="400"
                                    src={project.img}
                                    width="600"
                                    />
                                    <div className="p-5">
                                    <h4 className="text-xl font-semibold mb-2 text-indigo-700">
                                        {project.name}
                                    </h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {project.desc.length > 200 && expandedProject !== idx
                                        ? (
                                            <>
                                            {project.desc.slice(0, 200)}...
                                            <button
                                                className="text-indigo-600 ml-1 underline hover:text-indigo-800"
                                                onClick={e => { e.stopPropagation(); setExpandedProject(idx); }}
                                            >
                                                xem thêm
                                            </button>
                                            </>
                                        )
                                        : (
                                            <>
                                            {project.desc}
                                            {project.desc.length > 200 && (
                                                <button
                                                className="text-indigo-600 ml-1 underline hover:text-indigo-800"
                                                onClick={e => { e.stopPropagation(); setExpandedProject(null); }}
                                                >
                                                Ẩn bớt
                                                </button>
                                            )}
                                            </>
                                        )
                                        }
                                    </p>
                                    </div>
                                </div>
                                {/* Mặt sau */}
                                <div className="flip-card-back bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-5">
                                    <div className="relative border-l-4 border-indigo-200 pl-8">
                                    {project.timeline.map((step, i) => (
                                        <div key={i} className="mb-8 last:mb-0 relative">
                                        <div className="absolute -left-5 top-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow"></div>
                                        <div>
                                            <div className="font-bold text-indigo-700">{step.title}</div>
                                            <div className="text-xs text-gray-500 mb-1">
                                            {step.time} - {step.end}
                                            </div>
                                            <div className="text-gray-700 text-sm">{step.work}</div>
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                    <div className="text-center mt-4">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-gray-900 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                                    >
                                        <i className="fab fa-github mr-2"></i>
                                        Xem mã nguồn trên GitHub
                                    </a>
                                    </div>
                                </div>
                                </div>
                            </article>
                            ))}
                    </div>
                </section>

                <section className="mb-20" id="work-experience">
                    <h3 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
                        Kinh nghiệm làm việc
                    </h3>
                    <div className="flex flex-col items-center">
                       
                        <div className="mb-6 text-center">
                        <div className="text-xl font-bold text-indigo-700">CÔNG TY CỔ PHẦN IKU STUDIOS</div>
                        <div className="text-gray-500 text-sm">Thực tập sinh Backend Developer</div>
                        </div>
                        
                        <div className="relative flex justify-center items-center w-full max-w-2xl" style={{ minHeight: 240 }}>
                        
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-indigo-400 rounded"></div>
                        
                        <div className="absolute left-0 top-0 flex flex-col items-end h-full justify-between w-1/2 pr-16">
                            <div className="flex flex-col items-end">
                                <div className="bg-indigo-600 w-6 h-6 rounded-full mb-2 border-4 border-white shadow-lg"></div>
                                <div className="text-base text-gray-700 font-bold">Tháng 1-3</div>
                                <div className="text-sm text-gray-500 max-w-[180px] text-right">Làm quen môi trường, học quy trình, tham gia dự án nhỏ.</div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="bg-indigo-600 w-6 h-6 rounded-full mb-2 border-4 border-white shadow-lg"></div>
                                <div className="text-base text-gray-700 font-bold">Tháng 4-6</div>
                                <div className="text-sm text-gray-500 max-w-[180px] text-right">Tham gia phát triển chức năng chính, tối ưu code, báo cáo kết quả.</div>
                            </div>
                        </div>
                        
                        <div className="absolute right-0 top-0 flex flex-col items-start h-full justify-between w-1/2 pl-16">
                            <div className="flex flex-col items-start mt-12">
                                <div className="bg-indigo-600 w-6 h-6 rounded-full mb-2 border-4 border-white shadow-lg"></div>
                                <div className="text-base text-gray-700 font-bold">Tháng 1-3</div>
                                <div className="text-sm text-gray-500 max-w-[180px]">Học framework, làm việc nhóm, viết tài liệu.</div>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="bg-indigo-600 w-6 h-6 rounded-full mb-2 border-4 border-white shadow-lg"></div>
                                <div className="text-base text-gray-700 font-bold">Tháng 4-6</div>
                                <div className="text-sm text-gray-500 max-w-[180px]">Triển khai sản phẩm, bảo trì, hỗ trợ khách hàng.</div>
                            </div>
                        </div>
                    </div>
                    </div>
                </section>
                
                <section className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8" id="contact">
                    <h3 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                        Liên hệ với tôi
                    </h3>
                    <form
                        action="mailto:nguyenvana@example.com"
                        className="space-y-6"
                        encType="text/plain"
                        method="POST"
                    >
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                                Họ và tên
                            </label>
                            <input
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="name"
                                name="name"
                                placeholder="Nhập họ và tên của bạn"
                                required
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="email"
                                name="email"
                                placeholder="Nhập email của bạn"
                                required
                                type="email"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                                Tin nhắn
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="message"
                                name="message"
                                placeholder="Nhập tin nhắn của bạn"
                                required
                                rows="5"
                            ></textarea>
                        </div>
                        <div className="text-center">
                            <button
                                className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-indigo-700 transition"
                                type="submit"
                            >
                                Gửi
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 text-center text-gray-600">
                        <p>
                            <i className="fas fa-phone-alt mr-2 text-indigo-600"></i>
                            Điện thoại: 0123 456 789
                        </p>
                        <p>
                            <i className="fas fa-envelope mr-2 text-indigo-600"></i>
                            Email: nguyenvana@example.com
                        </p>
                        <p>
                            <i className="fas fa-map-marker-alt mr-2 text-indigo-600"></i>
                            Địa chỉ: Hà Nội, Việt Nam
                        </p>
                    </div>
                </section>
            </main>
            
            <footer className="relative z-10 bg-indigo-600 text-white py-6 mt-12">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p>
                        © 2024 Nguyễn Văn A. Bản quyền được bảo lưu.
                    </p>
                </div>
            </footer>
        </div>
            <style>
                {`     
                .clip-triangle img {
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    border-radius: 0 !important;
                    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
                }
               .clip-hexagon img {
                    clip-path: polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%);
                    border-radius: 0 !important;
                    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
                }
                @keyframes showQR {
                    from { opacity: 0; transform: scale(0.9);}
                    to { opacity: 1; transform: scale(1);}
                }

              .flip-card {
                    perspective: 1200px;
                    width: 100%;
                    position: relative;
                }
                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: auto;
                    transition: transform 0.6s cubic-bezier(.4,2,.6,1);
                    transform-style: preserve-3d;
                    min-height: 500px;
                }
                .flip-card.flipped .flip-card-inner,
                .flip-card-inner.flipped {
                    transform: rotateY(180deg);
                }
                .flip-card-front, .flip-card-back {
                    backface-visibility: hidden;
                    width: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                }
                .flip-card-front {
                    z-index: 2;
                }
                .flip-card-back {
                    transform: rotateY(180deg);
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                `}
            </style>
        </>
    );
}

export default Home;