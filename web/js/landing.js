// Particles configuration for Landing Page Background
document.addEventListener("DOMContentLoaded", function () {
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "connect",
                    },
                    resize: true,
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    connect: {
                        distance: 150,
                        links: { opacity: 0.5 },
                        radius: 60
                    },
                },
            },
            particles: {
                color: {
                    value: ["#a78bfa", "#ec4899", "#3b82f6"], // HueX vibrant colors
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.1,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 40, // Elegant, not too crowded
                },
                opacity: {
                    value: 0.4,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 },
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
            },
            detectRetina: true,
        });
    }
});
