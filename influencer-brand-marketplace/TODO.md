# Testing Plan for Proposals and Instagram Stats Features

## 1. Setup Environment
- [ ] Start backend server
- [ ] Start frontend client
- [ ] Verify servers are running and accessible

## 2. UI Testing - Proposal Submission
- [ ] Navigate to CampaignDetail page as influencer
- [ ] Open proposal submission modal
- [ ] Fill out and submit proposal form
- [ ] Verify success message and modal closes
- [ ] Check proposal appears in campaign data

## 3. UI Testing - Proposal Management
- [ ] Navigate to Proposals page as brand
- [ ] View campaigns with proposals
- [ ] Accept a proposal
- [ ] Reject a proposal
- [ ] Verify status updates correctly

## 4. API Testing - Backend Endpoints
- [ ] Test campaign apply endpoint (POST /campaigns/:id/apply)
- [ ] Test proposal update endpoint (PUT /campaigns/:id/proposals/:proposalId)
- [ ] Test Instagram stats refresh endpoint (POST /influencer/:id/refresh-instagram-stats)

## 5. Responsiveness Testing
- [ ] Test proposal modal on mobile screen sizes
- [ ] Test proposals management page on tablet/desktop
- [ ] Verify layout adapts correctly

## 6. Accessibility Testing
- [ ] Test keyboard navigation in proposal modal
- [ ] Verify ARIA labels and roles
- [ ] Check screen reader compatibility

## 7. Final Verification
- [ ] Ensure all features work end-to-end
- [ ] Check for any console errors
- [ ] Verify data persistence across sessions
