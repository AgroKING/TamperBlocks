import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BlurText from "../components/BlurText";

export function Home() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const mouse = { x: null, y: null, radius: 180 };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        class Particle {
            constructor(type) {
                this.type = type;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.size = type === "block" ? Math.random() * 8 + 12 : Math.random() * 3 + 2;
                this.angle = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.rotSpeed;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                if (this.type === "block") {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle);

                    const s = this.size;

                    ctx.fillStyle = "rgba(197, 155, 39, 0.4)";
                    ctx.beginPath();
                    ctx.moveTo(0, -s);
                    ctx.lineTo(s * 0.86, -s * 0.5);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(-s * 0.86, -s * 0.5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = "rgba(197, 155, 39, 0.8)";
                    ctx.stroke();

                    ctx.fillStyle = "rgba(15, 33, 61, 0.3)";
                    ctx.beginPath();
                    ctx.moveTo(-s * 0.86, -s * 0.5);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(0, s);
                    ctx.lineTo(-s * 0.86, s * 0.5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "rgba(197, 155, 39, 0.2)";
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(s * 0.86, -s * 0.5);
                    ctx.lineTo(s * 0.86, s * 0.5);
                    ctx.lineTo(0, s);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = "#c59b27";
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "#c59b27";
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        let particles = [];
        const initParticles = () => {
            particles = [];
            const count = Math.floor((width * height) / 12000);

            for (let i = 0; i < count; i++) {
                const type = Math.random() < 0.3 ? "block" : "node";
                particles.push(new Particle(type));
            }
        };

        const connectParticles = () => {
            const maxDistance = 140;

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = 1 - dist / maxDistance;
                        ctx.strokeStyle = `rgba(197, 155, 39, ${alpha * 0.25})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[a].x - mouse.x;
                    const dy = particles[a].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const alpha = 1 - dist / mouse.radius;
                        ctx.strokeStyle = `rgba(197, 155, 39, ${alpha * 0.5})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            connectParticles();
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        initParticles();
        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="home-page">

            <canvas ref={canvasRef} className="interactive-blockchain-canvas" />

            <div className="home-container">

                {/* Left Side: Header & Editorial */}
                <div className="home-header">
                    <span className="home-eyebrow">
                        Team OmniCoded
                    </span>

                    <div className="home-header-title" style={{margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <BlurText
                            text="Academic Credential Verification System"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="blur-title"
                        />
                    </div>

                    <p className="hero-subtitle">
                        Secure, tamper-proof academic credentials
                        powered by blockchain technology.
                    </p>

                    <div className="blockchain-editorial">
                        <div className="editorial-divider"></div>
                        <p>
                            In an era where digital trust is paramount, blockchain technology revolutionizes how we authenticate achievements. By leveraging an immutable, decentralized ledger, we eliminate credential fraud, drastically reduce verification friction, and restore absolute confidence to global academic and employment systems.
                        </p>
                        <p>
                            Every issued record is cryptographically secured, permanently accessible, and mathematically verifiable—ensuring the lifelong integrity of digital qualifications.
                        </p>
                    </div>
                </div>

                {/* Right Side: Redesigned Elevated Action Cards */}
                <div className="home-actions">

                    {/* Card 1: University Portal */}
                    <div className="home-action-card card-university">
                        <div className="card-top-bar">
                            <span className="card-badge badge-gold">ISSUER PORTAL</span>
                        </div>

                        <div className="card-body">
                            <div className="home-action-icon icon-gold">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 21h18"></path>
                                    <path d="M5 21V7l7-4 7 4v14"></path>
                                    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path>
                                    <line x1="9" y1="11" x2="9" y2="11.01"></line>
                                    <line x1="15" y1="11" x2="15" y2="11.01"></line>
                                    <path d="M12 2v3"></path>
                                </svg>
                            </div>

                            <h2>University Portal</h2>

                            <p>
                                Issue new academic credentials and
                                manage existing student records with immutable security.
                            </p>

                            <button
                                className="home-button button-gold"
                                onClick={() => navigate("/university")}
                            >
                                University Portal
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Institution Portal */}
                    <div className="home-action-card card-institution">
                        <div className="card-top-bar">
                            <span className="card-badge badge-navy">VERIFIER PORTAL</span>
                        </div>

                        <div className="card-body">
                            <div className="home-action-icon icon-navy">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    <path d="M9 12l2 2 4-4"></path>
                                    <circle cx="17" cy="17" r="3"></circle>
                                    <line x1="19" y1="19" x2="22" y2="22"></line>
                                </svg>
                            </div>

                            <h2>Institution Portal</h2>

                            <p>
                                Instantaneously verify student credentials against
                                live cryptographic blockchain proofs.
                            </p>

                            <button
                                className="home-button button-navy"
                                onClick={() => navigate("/institution")}
                            >
                                Institution Portal
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Blockchain Visualizer */}
                    <div className="home-action-card card-blockchain">
                        <div className="card-top-bar">
                            <span className="card-badge badge-teal">LIVE LEDGER</span>
                        </div>

                        <div className="card-body">
                            <div className="home-action-icon icon-teal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
                                    <line x1="8" y1="6" x2="8" y2="18"></line>
                                    <line x1="16" y1="6" x2="16" y2="18"></line>
                                </svg>
                            </div>

                            <h2>Blockchain Ledger</h2>

                            <p>
                                Explore the live structure and integrity of the credential blockchain network.
                            </p>

                            <button
                                className="home-button button-teal"
                                onClick={() => navigate("/blockchain")}
                            >
                                View Blockchain
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}