import { useState, useEffect } from "react";
import { api } from "../services/api";
import SideRays from '../components/SideRays';

function BlockchainStatus() {

    const [status, setStatus] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                <h1>Blockchain Status</h1>

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

                <div className="chain-title">
                    <span>LIVE LEDGER</span>
                    <h2>Contract Details</h2>
                </div>

                <div className="blockchain-chain">
                    {/* The Genesis/Contract Block */}
                    <div className="block-wrapper">
                        <div className="block-node">
                            <span>CONTRACT</span>
                            <strong>INFO</strong>
                        </div>
                        <div className="block-card">
                            <div className="block-card-header">
                                <span>SMART CONTRACT</span>
                                <span className="block-valid">● DEPLOYED</span>
                            </div>
                            <div className="block-data">
                                <div>
                                    <span>CONTRACT ADDRESS</span>
                                    <code>{status.contract_address}</code>
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
                    {blocks.map((block, i) => (
                        <div className="block-wrapper" key={block.hash}>
                            <div className="block-node">
                                <span>BLOCK</span>
                                <strong>#{block.block_index}</strong>
                            </div>
                            <div className="block-card" style={block.revoked ? {borderLeft: '4px solid #ef4444'} : {borderLeft: '4px solid #22c55e'}}>
                                <div className="block-card-header" style={block.revoked ? {backgroundColor: '#fee2e2', color: '#b91c1c'} : {}}>
                                    <span>CERTIFICATE RECORD</span>
                                    <span className={block.revoked ? "block-invalid" : "block-valid"} style={block.revoked ? {color: '#ef4444'} : {}}>
                                        ● {block.revoked ? "REVOKED" : "VALID"}
                                    </span>
                                </div>
                                <div className="block-data">
                                    <div>
                                        <span>STUDENT ID</span>
                                        <code>{block.student_id}</code>
                                    </div>
                                    <div>
                                        <span>TARGET HASH</span>
                                        <code style={{fontSize: '10px'}}>{block.hash}</code>
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
                    ))}
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