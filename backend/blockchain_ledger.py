"""
Cryptographic Audit Ledger Engine for Coal Mine Governance.
Ministry of Coal | SIH 2026 - Smart Compliance Monitoring.

Implements tamper-proof SHA-256 hash chaining with proof-of-compliance nonces,
enforcing immutability for statutory inspections, DGMS directives, EC clearances,
and emergency authority dispatches.
"""

import hashlib
import json
import time
from typing import Dict, List, Any, Optional

class Block:
    def __init__(
        self, 
        index: int, 
        timestamp: str, 
        action_type: str, 
        actor_id: str, 
        actor_role: str, 
        mine_id: str, 
        payload: Dict[str, Any], 
        prev_hash: str,
        nonce: int = 0
    ):
        self.index = index
        self.timestamp = timestamp
        self.action_type = action_type
        self.actor_id = actor_id
        self.actor_role = actor_role
        self.mine_id = mine_id
        self.payload = payload
        self.prev_hash = prev_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        """Compute deterministic SHA-256 digest across all block fields including nonce."""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "action_type": self.action_type,
            "actor_id": self.actor_id,
            "actor_role": self.actor_role,
            "mine_id": self.mine_id,
            "nonce": self.nonce,
            "payload": self.payload,
            "prev_hash": self.prev_hash,
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode("utf-8")).hexdigest()

    def mine_block(self, difficulty: int = 1):
        """Enforce cryptographic proof-of-compliance (hash prefix matching difficulty)."""
        target = "0" * difficulty
        while not self.hash.startswith(target):
            self.nonce += 1
            self.hash = self.calculate_hash()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "action_type": self.action_type,
            "actor_id": self.actor_id,
            "actor_role": self.actor_role,
            "mine_id": self.mine_id,
            "nonce": self.nonce,
            "payload": self.payload,
            "prev_hash": self.prev_hash,
            "hash": self.hash,
        }

class StatutoryAuditLedger:
    def __init__(self):
        self.chain: List[Block] = []
        self._initialize_genesis_and_seed_history()

    def _initialize_genesis_and_seed_history(self):
        """Establish the immutable Genesis block and seed historical statutory milestones."""
        genesis = Block(
            index=0,
            timestamp="2026-08-01T00:00:00Z",
            action_type="GENESIS_INITIALIZATION",
            actor_id="MINISTRY_OF_COAL_ROOT",
            actor_role="Statutory Apex Authority",
            mine_id="ALL_MINES",
            payload={"system": "CIL Smart Governance Platform", "protocol": "DGMS/CPCB SHA-256 Ledger v2.4"},
            prev_hash="0" * 64,
            nonce=101
        )
        genesis.mine_block(difficulty=1)
        self.chain.append(genesis)

        # Pre-seed realistic statutory actions
        seed_actions = [
            ("2026-08-15T10:30:00Z", "EC_COMPLIANCE_AUDIT", "DGMS_INSP_042", "DGMS Inspector", "gevra", {"findings": "Haul road width compliant, OB bench slope verified at 38 deg"}),
            ("2026-08-20T14:15:00Z", "SHOW_CAUSE_NOTICE", "CPCB_RO_08", "CPCB Regional Officer", "nigahi", {"notice_ref": "CPCB/NIG/2026/03", "defect": "Fugitive dust exceedance in crushing zone"}),
            ("2026-08-28T09:00:00Z", "PERMIT_TO_WORK_ISSUANCE", "MGR_KUS_01", "Mine Safety Head", "kusmunda", {"ptw_id": "PTW-2026-088", "scope": "Deep blasting block 7", "safeguards_verified": True}),
            ("2026-09-02T16:45:00Z", "CONTRACTOR_SAFETY_PENALTY", "DGMS_DIR_01", "DGMS Director", "nigahi", {"contractor": "Contractor B (Apex Infrastructure & Logistics)", "action": "Grounding of 5 uncalibrated tippers"}),
            ("2026-09-05T11:20:00Z", "STATUTORY_REPORT_FILED", "OFFICER_GEV_02", "Mine Manager", "gevra", {"form": "DGMS Form IV", "period": "August 2026", "sign_off_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}),
            ("2026-09-08T08:00:00Z", "MOBILE_GEO_INSPECTION", "INSP_VERMA_01", "Field Safety Officer", "gevra", {"obs_id": "OBS-2026-0901", "hazard": "Haul road berm defect", "coords": "22.3368, 82.5461"}),
        ]

        for ts, action, actor_id, actor_role, mine_id, payload in seed_actions:
            self.add_entry(action_type=action, actor_id=actor_id, actor_role=actor_role, mine_id=mine_id, payload=payload, timestamp=ts)

    def add_entry(
        self, 
        action_type: str, 
        actor_id: str, 
        actor_role: str, 
        mine_id: str, 
        payload: Dict[str, Any], 
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """Append and mine a new cryptographic block, chained to the tail of the ledger."""
        prev_block = self.chain[-1]
        ts = timestamp or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        new_block = Block(
            index=len(self.chain),
            timestamp=ts,
            action_type=action_type,
            actor_id=actor_id,
            actor_role=actor_role,
            mine_id=mine_id,
            payload=payload,
            prev_hash=prev_block.hash,
            nonce=0
        )
        new_block.mine_block(difficulty=1)
        self.chain.append(new_block)
        return new_block.to_dict()

    def verify_integrity(self) -> Dict[str, Any]:
        """Verify the cryptographic SHA-256 hash chaining and proof-of-compliance of the entire ledger."""
        if not self.chain:
            return {"valid": False, "error": "Ledger chain is empty", "compromised_block_index": -1}

        # Check Genesis
        genesis = self.chain[0]
        if genesis.index != 0 or genesis.prev_hash != "0" * 64:
            return {
                "valid": False,
                "error": "Genesis block corrupted: invalid index or root previous hash.",
                "compromised_block_index": 0
            }

        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]

            if curr.index != i:
                return {
                    "valid": False,
                    "error": f"Sequential index mismatch at Block #{curr.index}. Expected index {i}.",
                    "compromised_block_index": curr.index
                }

            if curr.prev_hash != prev.hash:
                return {
                    "valid": False,
                    "error": f"Hash link broken at Block #{curr.index}. Expected prev_hash {prev.hash}, got {curr.prev_hash}",
                    "compromised_block_index": curr.index
                }

            if curr.hash != curr.calculate_hash():
                return {
                    "valid": False,
                    "error": f"Tampering detected! Block #{curr.index} recalculation mismatch.",
                    "compromised_block_index": curr.index
                }

            if not curr.hash.startswith("0"):
                return {
                    "valid": False,
                    "error": f"Proof-of-compliance violation at Block #{curr.index}: Nonce does not satisfy difficulty criteria.",
                    "compromised_block_index": curr.index
                }

        return {
            "valid": True,
            "message": "All cryptographic SHA-256 blocks verified successfully. Zero tampering detected.",
            "total_blocks": len(self.chain),
            "latest_block_hash": self.chain[-1].hash
        }

    def get_all_blocks(self) -> List[Dict[str, Any]]:
        """Return ledger history in reverse chronological order."""
        return [b.to_dict() for b in reversed(self.chain)]

# Singleton instance
ledger_instance = StatutoryAuditLedger()
