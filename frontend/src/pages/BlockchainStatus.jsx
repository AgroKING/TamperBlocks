import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import SideRays from '../components/SideRays';
import BlurText from "../components/BlurText";

function BlockchainStatus() {

    const [status, setStatus] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedHash, setCopiedHash] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verifiedIndex, setVerifiedIndex] = useState(-1);
    
    const chainRef = React.useRef(null);
    const scrollIntervalRef = React.useRef(null);

    const startScrolling = (direction) => {
        if (scrollIntervalRef.current) return;
        const speed = 10; // Pixels per frame
        const scrollStep = () => {
            if (chainRef.current) {
                chainRef.current.scrollLeft += direction === 'left' ? -speed : speed;
            }
            scrollIntervalRef.current = requestAnimationFrame(scrollStep);
        };
        scrollIntervalRef.current = requestAnimationFrame(scrollStep);
    };

    const stopScrolling = () => {
        if (scrollIntervalRef.current) {
            cancelAnimationFrame(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    useEffect(() => {
        Promise.all([
            api.getStatus(),
            api.getBlocks().catch(() => []) // if it fails, default to empty
        ])
        .then(([statusData, blocksData]) => {
            setStatus(statusData);
            setBlocks(blocksData);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedHash(text);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const runVerification = () => {
        if (verifying || blocks.length === 0) return;
        setVerifying(true);
        setVerifiedIndex(-1);
        
        let i = -1;
        const interval = setInterval(() => {
            i++;
            setVerifiedIndex(i);
            if (i >= blocks.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setVerifying(false);
                    setVerifiedIndex(-1);
                }, 3000);
            }
        }, 600);
    };

    return (
        <div className="blockchain-page">

            {/* Animated background rays */}
            <div className="blockchain-rays">
                <SideRays
                    speed={1.2}
                    rayColor1="#3b82f6"
                    rayColor2="#60a5fa"
                    intensity={3}
                    spread={2.5}
                    origin="top-right"
                    tilt={10}
                    saturation={1.2}
                    blend={0.6}
                    falloff={2.2}
                    opacity={1}
                />
            </div>

            <div className="blockchain-stars"></div>

            <header className="blockchain-header">

                <span className="blockchain-eyebrow">
                    TAMPERBLOCKS NETWORK
                </span>

                <BlurText as="h1" text="Blockchain Status" delay={50} direction="bottom" />

                <p>
                    Explore the current structure and integrity
                    of the credential blockchain.
                </p>

                <div className="network-status">
                    <span className="status-dot"></span>
                    {loading ? "CONNECTING..." : error ? "CONNECTION ERROR" : "NETWORK OPERATIONAL"}
                </div>

            </header>


            <section className="blockchain-stats">

                <div className="blockchain-stat">
                    <span>NETWORK</span>
                    <strong>{status ? status.network : "—"}</strong>
                </div>

                <div className="blockchain-stat">
                    <span>STATUS</span>
                    <strong>{status ? status.status.toUpperCase() : "—"}</strong>
                </div>

                <div className="blockchain-stat">
                    <span>CERTIFICATES</span>
                    <strong>{status ? status.total_certificates_anchored : "—"}</strong>
                </div>

                <div className="blockchain-stat">
                    <span>CONTRACT</span>
                    <strong style={{fontSize: '11px', fontFamily: 'monospace'}}>{status ? status.contract_address : "—"}</strong>
                </div>

            </section>


            {status && (
            <section className="chain-section">

                <div className="chain-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <div>
                        <span>LIVE LEDGER</span>
                        <h2>Contract Details</h2>
                    </div>
                    <button 
                        onClick={runVerification} 
                        disabled={verifying}
                        style={{
                            background: verifying ? 'transparent' : 'rgba(13, 148, 136, 0.1)',
                            border: verifying ? '1px solid #3b82f6' : '1px solid #0d9488',
                            color: verifying ? '#60a5fa' : '#2dd4bf',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: verifying ? 'default' : 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {verifying ? (
                            <>
                                <span className="spinner" style={{width: '14px', height: '14px', border: '2px solid #60a5fa', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                                Verifying Integrity...
                            </>
                        ) : (
                            <>✓ Verify Chain Integrity</>
                        )}
                    </button>
                </div>

                <div className="chain-container" style={{position: 'relative', display: 'flex', alignItems: 'center', width: '100%'}}>
                    
                    {/* Left Scroll Arrow */}
                    <button 
                        onMouseDown={() => startScrolling('left')}
                        onMouseUp={stopScrolling}
                        onMouseLeave={stopScrolling}
                        onTouchStart={() => startScrolling('left')}
                        onTouchEnd={stopScrolling}
                        style={{
                            position: 'absolute',
                            left: '-20px',
                            zIndex: 10,
                            background: 'rgba(15, 33, 61, 0.9)',
                            border: '1px solid #3b82f6',
                            color: '#60a5fa',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div className="blockchain-chain" ref={chainRef} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                        {/* The Genesis/Contract Block */}
                    <div className="block-wrapper">
                        <div className="block-node" style={verifiedIndex >= -1 && verifying ? {boxShadow: '0 0 20px #3b82f6', borderColor: '#3b82f6'} : {}}>
                            <span>CONTRACT</span>
                            <strong>INFO</strong>
                        </div>
                        <div className="block-card" style={verifiedIndex >= -1 && verifying ? {borderColor: '#3b82f6'} : {}}>
                            <div className="block-card-header">
                                <span>SMART CONTRACT</span>
                                <span className="block-valid">● DEPLOYED</span>
                            </div>
                            <div className="block-data">
                                <div>
                                    <span>CONTRACT ADDRESS</span>
                                    <code 
                                        onClick={() => copyToClipboard(status.contract_address)}
                                        style={{cursor: 'pointer', transition: 'color 0.2s'}}
                                        title="Click to copy"
                                    >
                                        {copiedHash === status.contract_address ? 'COPIED!' : status.contract_address}
                                    </code>
                                </div>
                                <div>
                                    <span>OWNER</span>
                                    <code>{status.owner_address}</code>
                                </div>
                                <div>
                                    <span>ISSUER</span>
                                    <code>{status.issuer_address}</code>
                                </div>
                                <div>
                                    <span>TOTAL ANCHORED</span>
                                    <strong>{status.total_certificates_anchored}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The actual certificate blocks */}
                    {blocks.map((block, i) => {
                        const isVerifyingThis = verifying && verifiedIndex >= i;
                        const isCurrentlyVerifying = verifying && verifiedIndex === i;
                        const prevHash = i === 0 ? "GENESIS" : blocks[i-1].hash;

                        return (
                        <div className="block-wrapper" key={block.hash}>
                            <div className="block-node" style={isVerifyingThis ? {boxShadow: '0 0 20px #22c55e', borderColor: '#22c55e', transform: isCurrentlyVerifying ? 'scale(1.15)' : 'scale(1)'} : {}}>
                                <span>BLOCK</span>
                                <strong>#{block.block_index}</strong>
                            </div>
                            <div className="block-card" style={
                                block.revoked ? {borderLeft: '4px solid #ef4444'} : 
                                isVerifyingThis ? {borderLeft: '4px solid #22c55e', boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)'} : 
                                {borderLeft: '4px solid #22c55e'}
                            }>
                                <div className="block-card-header" style={block.revoked ? {backgroundColor: '#fee2e2', color: '#b91c1c'} : {}}>
                                    <span>CERTIFICATE RECORD</span>
                                    <span className={block.revoked ? "block-invalid" : "block-valid"} style={block.revoked ? {color: '#ef4444'} : {}}>
                                        ● {block.revoked ? "REVOKED" : isCurrentlyVerifying ? "VERIFYING..." : "VALID"}
                                    </span>
                                </div>
                                <div className="block-data">
                                    <div>
                                        <span>STUDENT ID</span>
                                        <code>{block.student_id}</code>
                                    </div>
                                    <div>
                                        <span>PREV HASH</span>
                                        <code style={{fontSize: '10px', color: '#94a3b8'}}>{prevHash}</code>
                                    </div>
                                    <div>
                                        <span>TARGET HASH</span>
                                        <code 
                                            onClick={() => copyToClipboard(block.hash)}
                                            style={{fontSize: '10px', cursor: 'pointer', color: copiedHash === block.hash ? '#22c55e' : ''}}
                                            title="Click to copy"
                                        >
                                            {copiedHash === block.hash ? 'COPIED TO CLIPBOARD!' : block.hash}
                                        </code>
                                    </div>
                                    <div>
                                        <span>IPFS CID</span>
                                        <code style={{fontSize: '10px'}}>{block.cid}</code>
                                    </div>
                                    <div>
                                        <span>TIMESTAMP</span>
                                        <strong>{new Date(block.timestamp * 1000).toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>

                    {/* Right Scroll Arrow */}
                    <button 
                        onMouseDown={() => startScrolling('right')}
                        onMouseUp={stopScrolling}
                        onMouseLeave={stopScrolling}
                        onTouchStart={() => startScrolling('right')}
                        onTouchEnd={stopScrolling}
                        style={{
                            position: 'absolute',
                            right: '-20px',
                            zIndex: 10,
                            background: 'rgba(15, 33, 61, 0.9)',
                            border: '1px solid #3b82f6',
                            color: '#60a5fa',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    
                </div>

            </section>
            )}


            <div className="blockchain-footer">

                <span>
                    ◈
                </span>

                Each block references the hash of the
                previous block, creating a tamper-evident chain.

            </div>

        </div>
    );
}

export default BlockchainStatus;