/**
 * CertifyStudio Pro - Bulk Certificate Generator & Drag-and-Drop Studio
 * Vanilla JavaScript Core Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STATE MANAGEMENT
    // ==========================================
    const state = {
        activeTemplate: 'golden', // 'golden', 'minimal', 'academic', 'custom'
        customBgImage: null,
        signatureImage: null,
        
        recipients: [
            "Alexander Hamilton",
            "Dr. Elizabeth Blackwell",
            "Marcus Aurelius Antoninus",
            "Sophia Rodriguez-Chen",
            "James O'Connor",
            "Aisha Al-Mansoor",
            "Prof. Jonathan Vance Jr."
        ],
        currentIndex: 0,
        
        selectedElementKey: 'name', // 'name', 'signature'
        snapToGuides: true,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        showSnapV: false,
        showSnapH: false,

        elements: {
            name: {
                type: 'text',
                label: 'Recipient Name',
                x: 0.50, // % of width
                y: 0.48, // % of height
                fontFamily: 'Playfair Display',
                fontSize: 68,
                color: '#1E293B',
                textAlign: 'center',
                textCase: 'title',
                fontWeight: 'bold',
                fontStyle: 'normal'
            },
            signature: {
                type: 'image',
                label: 'Signature Image',
                x: 0.50,
                y: 0.76,
                scale: 0.8
            }
        }
    };

    // ==========================================
    // 2. DOM ELEMENT REFERENCES
    // ==========================================
    const canvas = document.getElementById('certCanvas');
    const ctx = canvas.getContext('2d');

    // Headers & Badges
    const headerRecipientBadge = document.getElementById('headerRecipientBadge');
    const recipientCountBadge = document.getElementById('recipientCountBadge');
    const btnGenerateZipText = document.getElementById('btnGenerateZipText');
    const bottomRecipientName = document.getElementById('bottomRecipientName');
    const bottomPageBadge = document.getElementById('bottomPageBadge');

    // Controls Tabs
    const tabBtnTemplate = document.getElementById('tabBtnTemplate');
    const tabBtnRecipients = document.getElementById('tabBtnRecipients');
    const tabBtnStyling = document.getElementById('tabBtnStyling');
    const tabBtnSignature = document.getElementById('tabBtnSignature');

    const tabContentTemplate = document.getElementById('tabContentTemplate');
    const tabContentRecipients = document.getElementById('tabContentRecipients');
    const tabContentStyling = document.getElementById('tabContentStyling');
    const tabContentSignature = document.getElementById('tabContentSignature');

    // Template Presets
    const presetGolden = document.getElementById('presetGolden');
    const presetMinimal = document.getElementById('presetMinimal');
    const presetAcademic = document.getElementById('presetAcademic');
    const templateDropzone = document.getElementById('templateDropzone');
    const templateFileInput = document.getElementById('templateFileInput');
    const customTemplateStatus = document.getElementById('customTemplateStatus');
    const customTemplateName = document.getElementById('customTemplateName');
    const btnRemoveCustomTemplate = document.getElementById('btnRemoveCustomTemplate');

    // Recipients Input
    const recipientListInput = document.getElementById('recipientListInput');
    const btnLoadDemo = document.getElementById('btnLoadDemo');
    const btnTrimNames = document.getElementById('btnTrimNames');
    const btnClearNames = document.getElementById('btnClearNames');
    const btnPrevRecipient = document.getElementById('btnPrevRecipient');
    const btnNextRecipient = document.getElementById('btnNextRecipient');
    const btnBottomPrev = document.getElementById('btnBottomPrev');
    const btnBottomNext = document.getElementById('btnBottomNext');
    const recipientPaginationLabel = document.getElementById('recipientPaginationLabel');

    // Styling & Positioning
    const selectElemName = document.getElementById('selectElemName');
    const selectElemSig = document.getElementById('selectElemSig');
    
    const activeElementTag = document.getElementById('activeElementTag');
    const textControlsContainer = document.getElementById('textControlsContainer');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const btnToggleBold = document.getElementById('btnToggleBold');
    const btnToggleItalic = document.getElementById('btnToggleItalic');
    const textColorPicker = document.getElementById('textColorPicker');
    const textColorHex = document.getElementById('textColorHex');
    const btnAlignLeft = document.getElementById('btnAlignLeft');
    const btnAlignCenter = document.getElementById('btnAlignCenter');
    const btnAlignRight = document.getElementById('btnAlignRight');
    const textCaseSelect = document.getElementById('textCaseSelect');

    const posXSlider = document.getElementById('posXSlider');
    const posXValue = document.getElementById('posXValue');
    const btnCenterHorizontal = document.getElementById('btnCenterHorizontal');

    const posYSlider = document.getElementById('posYSlider');
    const posYValue = document.getElementById('posYValue');
    const btnCenterVertical = document.getElementById('btnCenterVertical');

    // Signature Tab
    const signatureDropzone = document.getElementById('signatureDropzone');
    const signatureFileInput = document.getElementById('signatureFileInput');
    const signatureActiveControls = document.getElementById('signatureActiveControls');
    const signaturePreviewImg = document.getElementById('signaturePreviewImg');
    const btnRemoveSignature = document.getElementById('btnRemoveSignature');
    const sigScaleSlider = document.getElementById('sigScaleSlider');
    const sigScaleValue = document.getElementById('sigScaleValue');

    // Canvas Toolbar & Actions
    const chkSnapGuides = document.getElementById('chkSnapGuides');
    const btnResetPositions = document.getElementById('btnResetPositions');
    const btnDownloadSingle = document.getElementById('btnDownloadSingle');
    const btnGenerateZip = document.getElementById('btnGenerateZip');

    // Modals
    const helpModal = document.getElementById('helpModal');
    const btnOpenHelp = document.getElementById('btnOpenHelp');
    const btnCloseHelp = document.getElementById('btnCloseHelp');
    const btnGotItHelp = document.getElementById('btnGotItHelp');

    const progressModal = document.getElementById('progressModal');
    const progressStatusText = document.getElementById('progressStatusText');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercentage = document.getElementById('progressPercentage');

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // ==========================================
    // 3. PROGRAMMATIC PRESET DRAWING FUNCTIONS
    // ==========================================

    function drawPresetGolden(targetCtx, w, h) {
        // Deep Navy Luxury Gradient
        const grad = targetCtx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0B192C');
        grad.addColorStop(0.5, '#1E3E62');
        grad.addColorStop(1, '#0B192C');
        targetCtx.fillStyle = grad;
        targetCtx.fillRect(0, 0, w, h);

        // Gold Foil Outer Borders
        targetCtx.strokeStyle = '#D4AF37';
        targetCtx.lineWidth = Math.max(2, Math.round(h * 0.008));
        targetCtx.strokeRect(w * 0.03, h * 0.04, w * 0.94, h * 0.92);

        targetCtx.lineWidth = Math.max(1, Math.round(h * 0.003));
        targetCtx.strokeRect(w * 0.038, h * 0.052, w * 0.924, h * 0.896);

        // Corner Filigree Gold Accents
        const corners = [
            [w * 0.03, h * 0.04],
            [w * 0.97, h * 0.04],
            [w * 0.03, h * 0.96],
            [w * 0.97, h * 0.96]
        ];
        
        corners.forEach(([cx, cy]) => {
            targetCtx.fillStyle = '#D4AF37';
            targetCtx.beginPath();
            targetCtx.arc(cx, cy, Math.max(8, w * 0.008), 0, Math.PI * 2);
            targetCtx.fill();
        });

        // Header Title
        targetCtx.textAlign = 'center';
        targetCtx.fillStyle = '#E2C044';
        targetCtx.font = `bold ${Math.round(h * 0.05)}px "Cinzel", serif`;
        targetCtx.fillText('CERTIFICATE OF ACHIEVEMENT', w / 2, h * 0.22);

        // Subtitle
        targetCtx.fillStyle = '#CBD5E1';
        targetCtx.font = `500 ${Math.round(h * 0.025)}px "Montserrat", sans-serif`;
        targetCtx.fillText('THIS IS PROUDLY PRESENTED TO', w / 2, h * 0.32);

        // Sub-footer text
        targetCtx.fillStyle = '#94A3B8';
        targetCtx.font = `italic ${Math.round(h * 0.022)}px "Playfair Display", serif`;
        targetCtx.fillText('For exceptional dedication, outstanding performance, and extraordinary accomplishments.', w / 2, h * 0.65);

        // Gold Circular Seal Emblem
        const sealX = w / 2;
        const sealY = h * 0.80;
        const sealR = Math.round(h * 0.055);
        
        targetCtx.fillStyle = '#D4AF37';
        targetCtx.beginPath();
        targetCtx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
        targetCtx.fill();

        targetCtx.strokeStyle = '#FFFFFF';
        targetCtx.lineWidth = 2;
        targetCtx.beginPath();
        targetCtx.arc(sealX, sealY, sealR * 0.85, 0, Math.PI * 2);
        targetCtx.stroke();

        targetCtx.fillStyle = '#0B192C';
        targetCtx.font = `bold ${Math.round(sealR * 0.4)}px "Cinzel", serif`;
        targetCtx.fillText('VERIFIED', sealX, sealY + sealR * 0.12);
    }

    function drawPresetMinimal(targetCtx, w, h) {
        // Crisp White / Off-white background
        targetCtx.fillStyle = '#F8FAFC';
        targetCtx.fillRect(0, 0, w, h);

        // Geometric Polygon Accents (Top Left & Bottom Right)
        // Polygon 1 (Teal Dark)
        targetCtx.fillStyle = '#0F766E';
        targetCtx.beginPath();
        targetCtx.moveTo(0, 0);
        targetCtx.lineTo(w * 0.25, 0);
        targetCtx.lineTo(0, h * 0.45);
        targetCtx.closePath();
        targetCtx.fill();

        // Polygon 2 (Teal Light accent overlay)
        targetCtx.fillStyle = '#2DD4BF';
        targetCtx.globalAlpha = 0.75;
        targetCtx.beginPath();
        targetCtx.moveTo(0, 0);
        targetCtx.lineTo(w * 0.15, 0);
        targetCtx.lineTo(0, h * 0.60);
        targetCtx.closePath();
        targetCtx.fill();
        targetCtx.globalAlpha = 1.0;

        // Bottom Right Polygon
        targetCtx.fillStyle = '#0D9488';
        targetCtx.beginPath();
        targetCtx.moveTo(w, h);
        targetCtx.lineTo(w * 0.75, h);
        targetCtx.lineTo(w, h * 0.55);
        targetCtx.closePath();
        targetCtx.fill();

        // Sleek Margin Line
        targetCtx.strokeStyle = '#0F172A';
        targetCtx.lineWidth = Math.max(3, Math.round(h * 0.005));
        targetCtx.strokeRect(w * 0.05, h * 0.06, w * 0.90, h * 0.88);

        // Header Title
        targetCtx.textAlign = 'center';
        targetCtx.fillStyle = '#0F172A';
        targetCtx.font = `800 ${Math.round(h * 0.055)}px "Montserrat", sans-serif`;
        targetCtx.fillText('CERTIFICATE OF COMPLETION', w * 0.54, h * 0.22);

        // Subtitle
        targetCtx.fillStyle = '#0F766E';
        targetCtx.font = `600 ${Math.round(h * 0.024)}px "Montserrat", sans-serif`;
        targetCtx.fillText('PROUDLY PRESENTED TO', w * 0.54, h * 0.32);

        // Sub-footer text
        targetCtx.fillStyle = '#475569';
        targetCtx.font = `400 ${Math.round(h * 0.021)}px "Inter", sans-serif`;
        targetCtx.fillText('In recognition of successfully fulfilling all program requirements and requirements.', w * 0.54, h * 0.65);
    }

    function drawPresetAcademic(targetCtx, w, h) {
        // Parchment Ivory Background
        targetCtx.fillStyle = '#FAF7F2';
        targetCtx.fillRect(0, 0, w, h);

        // Burgundy Outer Margin Frame
        targetCtx.fillStyle = '#6B1D2F';
        targetCtx.fillRect(w * 0.02, h * 0.03, w * 0.96, h * 0.94);

        // Parchment Inner Box
        targetCtx.fillStyle = '#FAF7F2';
        targetCtx.fillRect(w * 0.032, h * 0.048, w * 0.936, h * 0.904);

        // Gold Inner Accent Line
        targetCtx.strokeStyle = '#C5A059';
        targetCtx.lineWidth = Math.max(2, Math.round(h * 0.004));
        targetCtx.strokeRect(w * 0.042, h * 0.062, w * 0.916, h * 0.876);

        // Header Title
        targetCtx.textAlign = 'center';
        targetCtx.fillStyle = '#6B1D2F';
        targetCtx.font = `bold ${Math.round(h * 0.052)}px "Playfair Display", serif`;
        targetCtx.fillText('CERTIFICATE OF EXCELLENCE', w / 2, h * 0.22);

        // Subtitle
        targetCtx.fillStyle = '#4A5568';
        targetCtx.font = `500 ${Math.round(h * 0.024)}px "Cinzel", serif`;
        targetCtx.fillText('IS HEREBY CONFERRED UPON', w / 2, h * 0.32);

        // Sub-footer text
        targetCtx.fillStyle = '#64748B';
        targetCtx.font = `italic ${Math.round(h * 0.022)}px "Georgia", serif`;
        targetCtx.fillText('Demonstrating superior academic performance and exemplary commitment to scholarly standards.', w / 2, h * 0.65);

        // Academic Ribbon Emblem
        const ribbonX = w / 2;
        const ribbonY = h * 0.12;
        targetCtx.fillStyle = '#C5A059';
        targetCtx.beginPath();
        targetCtx.arc(ribbonX, ribbonY, Math.round(h * 0.035), 0, Math.PI * 2);
        targetCtx.fill();
        targetCtx.fillStyle = '#6B1D2F';
        targetCtx.font = `bold ${Math.round(h * 0.025)}px "Cinzel", serif`;
        targetCtx.fillText('★', ribbonX, ribbonY + h * 0.008);
    }

    // Render Preset Thumbnails
    function renderThumbnails() {
        const thumbGoldenCanvas = document.getElementById('thumbGolden');
        const thumbMinimalCanvas = document.getElementById('thumbMinimal');
        const thumbAcademicCanvas = document.getElementById('thumbAcademic');

        if (thumbGoldenCanvas) drawPresetGolden(thumbGoldenCanvas.getContext('2d'), 320, 200);
        if (thumbMinimalCanvas) drawPresetMinimal(thumbMinimalCanvas.getContext('2d'), 320, 200);
        if (thumbAcademicCanvas) drawPresetAcademic(thumbAcademicCanvas.getContext('2d'), 320, 200);
    }

    // ==========================================
    // 4. MAIN CANVAS RENDERING ENGINE
    // ==========================================

    function renderCanvas(options = {}) {
        const exportMode = options.exportMode || false;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 1. Render Background
        if (state.activeTemplate === 'custom' && state.customBgImage) {
            ctx.drawImage(state.customBgImage, 0, 0, width, height);
        } else if (state.activeTemplate === 'minimal') {
            drawPresetMinimal(ctx, width, height);
        } else if (state.activeTemplate === 'academic') {
            drawPresetAcademic(ctx, width, height);
        } else {
            drawPresetGolden(ctx, width, height);
        }

        // 2. Render Signature Image (if present)
        const sig = state.elements.signature;
        let sigBox = null;

        if (state.signatureImage) {
            const sigW = state.signatureImage.width * sig.scale;
            const sigH = state.signatureImage.height * sig.scale;
            const sigX = (width * sig.x) - (sigW / 2);
            const sigY = (height * sig.y) - (sigH / 2);

            ctx.drawImage(state.signatureImage, sigX, sigY, sigW, sigH);

            sigBox = { x: sigX, y: sigY, w: sigW, h: sigH, label: sig.label };
        }

        // Helper to format text case
        const formatCase = (text, textCase) => {
            if (!text) return '';
            if (textCase === 'uppercase') return text.toUpperCase();
            if (textCase === 'title') {
                return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            }
            return text;
        };

        // 3. Render Recipient Name
        const nameElem = state.elements.name;
        const recipientRaw = state.recipients[state.currentIndex] || "Recipient Name";
        const nameText = formatCase(recipientRaw, nameElem.textCase);

        ctx.save();
        ctx.font = `${nameElem.fontStyle} ${nameElem.fontWeight} ${nameElem.fontSize}px "${nameElem.fontFamily}", sans-serif`;
        ctx.fillStyle = nameElem.color;
        ctx.textAlign = nameElem.textAlign;

        const nameMetrics = ctx.measureText(nameText);
        const nameW = nameMetrics.width;
        const nameH = nameElem.fontSize * 1.2;

        const nameX = width * nameElem.x;
        const nameY = height * nameElem.y;

        ctx.fillText(nameText, nameX, nameY);
        ctx.restore();

        let nameBoxX = nameX;
        if (nameElem.textAlign === 'center') nameBoxX = nameX - (nameW / 2);
        else if (nameElem.textAlign === 'right') nameBoxX = nameX - nameW;

        const nameBox = { x: nameBoxX, y: nameY - (nameElem.fontSize * 0.85), w: nameW, h: nameH, label: nameElem.label };

        // Store bounding boxes for hit testing
        state.boundingBoxes = {
            name: nameBox,
            signature: sigBox
        };

        // If in export mode, do not render selection boxes or snap lines
        if (exportMode) return;

        // 6. Draw Snap Center Lines (if active during dragging)
        if (state.snapToGuides && state.isDragging) {
            ctx.save();
            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 6]);

            if (state.showSnapV) {
                ctx.beginPath();
                ctx.moveTo(width / 2, 0);
                ctx.lineTo(width / 2, height);
                ctx.stroke();
            }

            if (state.showSnapH) {
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.stroke();
            }
            ctx.restore();
        }

        // 7. Draw Selection Box around Active Selected Element
        const activeBox = state.boundingBoxes[state.selectedElementKey];
        if (activeBox) {
            const pad = 10;
            const bx = activeBox.x - pad;
            const by = activeBox.y - pad;
            const bw = activeBox.w + (pad * 2);
            const bh = activeBox.h + (pad * 2);

            ctx.save();
            // Bounding rectangle stroke
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.strokeRect(bx, by, bw, bh);

            // Corner Handles
            ctx.setLineDash([]);
            ctx.fillStyle = '#2563EB';
            const handleSize = 10;
            const corners = [
                [bx, by],
                [bx + bw, by],
                [bx, by + bh],
                [bx + bw, by + bh]
            ];
            corners.forEach(([cx, cy]) => {
                ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
            });

            // Tag Badge Label
            const tagText = activeBox.label;
            ctx.font = 'bold 16px "Inter", sans-serif';
            const tagW = ctx.measureText(tagText).width + 20;
            const tagH = 26;
            const tagX = bx;
            const tagY = by - tagH - 4;

            ctx.fillStyle = '#2563EB';
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(tagX, tagY, tagW, tagH, 6) : ctx.fillRect(tagX, tagY, tagW, tagH);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText(tagText, tagX + 10, tagY + 18);

            ctx.restore();
        }
    }

    // ==========================================
    // 5. INTERACTIVE CANVAS DRAG & DROP
    // ==========================================

    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function hitTest(cx, cy) {
        const pad = 12;
        const keys = ['signature', 'name']; // top to bottom

        for (const key of keys) {
            const box = state.boundingBoxes[key];
            if (box) {
                if (
                    cx >= box.x - pad &&
                    cx <= box.x + box.w + pad &&
                    cy >= box.y - pad &&
                    cy <= box.y + box.h + pad
                ) {
                    return key;
                }
            }
        }
        return null;
    }

    function handleStart(e) {
        const { x: cx, y: cy } = getCanvasCoordinates(e);
        const hitKey = hitTest(cx, cy);

        if (hitKey) {
            state.selectedElementKey = hitKey;
            state.isDragging = true;

            const elem = state.elements[hitKey];
            const elemX = canvas.width * elem.x;
            const elemY = canvas.height * elem.y;

            state.dragOffsetX = cx - elemX;
            state.dragOffsetY = cy - elemY;

            updateInspectorUI();
            renderCanvas();
        }
    }

    function handleMove(e) {
        if (!state.isDragging) return;
        e.preventDefault();

        const { x: cx, y: cy } = getCanvasCoordinates(e);
        const elemKey = state.selectedElementKey;
        const elem = state.elements[elemKey];

        let targetX = (cx - state.dragOffsetX) / canvas.width;
        let targetY = (cy - state.dragOffsetY) / canvas.height;

        state.showSnapV = false;
        state.showSnapH = false;

        // Smart Center 50% Snapping
        if (state.snapToGuides) {
            const snapThreshold = 0.016; // 1.6% threshold
            if (Math.abs(targetX - 0.5) < snapThreshold) {
                targetX = 0.5;
                state.showSnapV = true;
            }
            if (Math.abs(targetY - 0.5) < snapThreshold) {
                targetY = 0.5;
                state.showSnapH = true;
            }
        }

        // Clamp inside canvas bounds
        elem.x = Math.max(0.02, Math.min(0.98, targetX));
        elem.y = Math.max(0.02, Math.min(0.98, targetY));

        updatePositionSliders();
        renderCanvas();
    }

    function handleEnd() {
        if (state.isDragging) {
            state.isDragging = false;
            state.showSnapV = false;
            state.showSnapH = false;
            renderCanvas();
        }
    }

    canvas.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    // ==========================================
    // 6. UI SYNCHRONIZATION & EVENT LISTENERS
    // ==========================================

    function updateRecipientsState() {
        const raw = recipientListInput.value;
        const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        if (lines.length === 0) {
            state.recipients = ["Recipient Name"];
        } else {
            state.recipients = lines;
        }

        if (state.currentIndex >= state.recipients.length) {
            state.currentIndex = Math.max(0, state.recipients.length - 1);
        }

        const count = state.recipients.length;
        headerRecipientBadge.textContent = count;
        recipientCountBadge.textContent = `${count} Recipient${count === 1 ? '' : 's'}`;
        btnGenerateZipText.textContent = `Generate & Download ZIP (${count})`;

        updatePaginationUI();
        renderCanvas();
    }

    function updatePaginationUI() {
        const current = state.currentIndex + 1;
        const total = state.recipients.length;
        const currentName = state.recipients[state.currentIndex] || "Recipient Name";

        recipientPaginationLabel.textContent = `Recipient ${current} of ${total}`;
        bottomPageBadge.textContent = `${current} / ${total}`;
        bottomRecipientName.textContent = currentName;

        btnPrevRecipient.disabled = state.currentIndex === 0;
        btnNextRecipient.disabled = state.currentIndex >= total - 1;
        btnBottomPrev.disabled = state.currentIndex === 0;
        btnBottomNext.disabled = state.currentIndex >= total - 1;
    }

    function updateInspectorUI() {
        const key = state.selectedElementKey;

        // Highlight Element Selector Button
        [selectElemName, selectElemSig].forEach(btn => btn.classList.remove('active'));
        if (key === 'name') selectElemName.classList.add('active');
        if (key === 'signature') selectElemSig.classList.add('active');

        // Toggle Text vs Signature controls visibility
        if (key === 'signature') {
            textControlsContainer.classList.add('hidden');
            switchTab('signature');
        } else {
            textControlsContainer.classList.remove('hidden');
            const elem = state.elements[key];
            activeElementTag.textContent = elem.label;

            fontFamilySelect.value = elem.fontFamily;
            fontSizeSlider.value = elem.fontSize;
            fontSizeValue.textContent = `${elem.fontSize}px`;

            btnToggleBold.className = `flex-1 py-1.5 border border-slate-300 rounded text-xs font-bold hover:bg-slate-100 transition ${elem.fontWeight === 'bold' ? 'bg-brand-100 border-brand-500 text-brand-800' : ''}`;
            btnToggleItalic.className = `flex-1 py-1.5 border border-slate-300 rounded text-xs italic hover:bg-slate-100 transition ${elem.fontStyle === 'italic' ? 'bg-brand-100 border-brand-500 text-brand-800' : ''}`;

            textColorPicker.value = elem.color;
            textColorHex.value = elem.color.toUpperCase();

            // Alignment buttons
            btnAlignLeft.className = `flex-1 py-1.5 text-slate-600 hover:bg-slate-100 flex items-center justify-center border-r border-slate-200 ${elem.textAlign === 'left' ? 'bg-brand-100 text-brand-800 font-bold' : ''}`;
            btnAlignCenter.className = `flex-1 py-1.5 text-slate-600 hover:bg-slate-100 flex items-center justify-center border-r border-slate-200 ${elem.textAlign === 'center' ? 'bg-brand-100 text-brand-800 font-bold' : ''}`;
            btnAlignRight.className = `flex-1 py-1.5 text-slate-600 hover:bg-slate-100 flex items-center justify-center ${elem.textAlign === 'right' ? 'bg-brand-100 text-brand-800 font-bold' : ''}`;

            textCaseSelect.value = elem.textCase;
        }

        updatePositionSliders();
    }

    function updatePositionSliders() {
        const elem = state.elements[state.selectedElementKey];
        const pctX = Math.round(elem.x * 100);
        const pctY = Math.round(elem.y * 100);

        posXSlider.value = pctX;
        posXValue.textContent = `${pctX}%`;

        posYSlider.value = pctY;
        posYValue.textContent = `${pctY}%`;
    }

    function switchTab(tabName) {
        [tabBtnTemplate, tabBtnRecipients, tabBtnStyling, tabBtnSignature].forEach(btn => btn.classList.remove('active'));
        [tabContentTemplate, tabContentRecipients, tabContentStyling, tabContentSignature].forEach(content => content.classList.add('hidden'));

        if (tabName === 'template') {
            tabBtnTemplate.classList.add('active');
            tabContentTemplate.classList.remove('hidden');
        } else if (tabName === 'recipients') {
            tabBtnRecipients.classList.add('active');
            tabContentRecipients.classList.remove('hidden');
        } else if (tabName === 'styling') {
            tabBtnStyling.classList.add('active');
            tabContentStyling.classList.remove('hidden');
        } else if (tabName === 'signature') {
            tabBtnSignature.classList.add('active');
            tabContentSignature.classList.remove('hidden');
        }
    }

    tabBtnTemplate.addEventListener('click', () => switchTab('template'));
    tabBtnRecipients.addEventListener('click', () => switchTab('recipients'));
    tabBtnStyling.addEventListener('click', () => switchTab('styling'));
    tabBtnSignature.addEventListener('click', () => switchTab('signature'));

    // Element Selector Buttons
    selectElemName.addEventListener('click', () => { state.selectedElementKey = 'name'; updateInspectorUI(); renderCanvas(); });
    selectElemSig.addEventListener('click', () => { state.selectedElementKey = 'signature'; updateInspectorUI(); renderCanvas(); });

    // Preset Selection
    function selectPreset(presetName) {
        state.activeTemplate = presetName;
        document.querySelectorAll('.preset-card').forEach(card => {
            card.classList.remove('border-brand-500', 'bg-brand-50/50');
            card.classList.add('border-slate-200');
            card.querySelector('.preset-active-check')?.classList.add('hidden');
        });

        const activeCard = presetName === 'golden' ? presetGolden : presetName === 'minimal' ? presetMinimal : presetAcademic;
        if (activeCard) {
            activeCard.classList.remove('border-slate-200');
            activeCard.classList.add('border-brand-500', 'bg-brand-50/50');
            activeCard.querySelector('.preset-active-check')?.classList.remove('hidden');
        }

        renderCanvas();
    }

    presetGolden.addEventListener('click', () => selectPreset('golden'));
    presetMinimal.addEventListener('click', () => selectPreset('minimal'));
    presetAcademic.addEventListener('click', () => selectPreset('academic'));

    // Custom Template Upload
    templateDropzone.addEventListener('click', () => templateFileInput.click());
    templateDropzone.addEventListener('dragover', (e) => { e.preventDefault(); templateDropzone.classList.add('border-brand-500', 'bg-brand-50'); });
    templateDropzone.addEventListener('dragleave', () => templateDropzone.classList.remove('border-brand-500', 'bg-brand-50'));
    templateDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        templateDropzone.classList.remove('border-brand-500', 'bg-brand-50');
        if (e.dataTransfer.files.length > 0) loadCustomTemplate(e.dataTransfer.files[0]);
    });
    templateFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) loadCustomTemplate(e.target.files[0]);
    });

    function loadCustomTemplate(file) {
        if (!file.type.match('image.*')) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                state.customBgImage = img;
                state.activeTemplate = 'custom';

                customTemplateName.textContent = file.name;
                customTemplateStatus.classList.remove('hidden');

                // Deselect preset borders
                document.querySelectorAll('.preset-card').forEach(card => {
                    card.classList.remove('border-brand-500', 'bg-brand-50/50');
                    card.classList.add('border-slate-200');
                    card.querySelector('.preset-active-check')?.classList.add('hidden');
                });

                renderCanvas();
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }

    btnRemoveCustomTemplate.addEventListener('click', () => {
        state.customBgImage = null;
        customTemplateStatus.classList.add('hidden');
        templateFileInput.value = '';
        selectPreset('golden');
    });

    // Signature Upload
    signatureDropzone.addEventListener('click', () => signatureFileInput.click());
    signatureDropzone.addEventListener('dragover', (e) => { e.preventDefault(); signatureDropzone.classList.add('border-brand-500', 'bg-brand-50'); });
    signatureDropzone.addEventListener('dragleave', () => signatureDropzone.classList.remove('border-brand-500', 'bg-brand-50'));
    signatureDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        signatureDropzone.classList.remove('border-brand-500', 'bg-brand-50');
        if (e.dataTransfer.files.length > 0) loadSignature(e.dataTransfer.files[0]);
    });
    signatureFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) loadSignature(e.target.files[0]);
    });

    function loadSignature(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                state.signatureImage = img;
                signaturePreviewImg.src = evt.target.result;
                signatureActiveControls.classList.remove('hidden');

                // Auto select signature
                state.selectedElementKey = 'signature';
                updateInspectorUI();
                renderCanvas();
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }

    btnRemoveSignature.addEventListener('click', () => {
        state.signatureImage = null;
        signatureFileInput.value = '';
        signatureActiveControls.classList.add('hidden');
        state.selectedElementKey = 'name';
        updateInspectorUI();
        renderCanvas();
    });

    sigScaleSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        sigScaleValue.textContent = `${val}%`;
        state.elements.signature.scale = val / 100;
        renderCanvas();
    });

    // Recipient Controls & Utilities
    recipientListInput.addEventListener('input', updateRecipientsState);

    btnLoadDemo.addEventListener('click', () => {
        recipientListInput.value = state.recipients.join('\n');
        updateRecipientsState();
    });

    btnTrimNames.addEventListener('click', () => {
        const raw = recipientListInput.value;
        const cleaned = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n');
        recipientListInput.value = cleaned;
        updateRecipientsState();
    });

    btnClearNames.addEventListener('click', () => {
        recipientListInput.value = '';
        updateRecipientsState();
    });

    // Pagination Event Handlers
    function prevRecipient() {
        if (state.currentIndex > 0) {
            state.currentIndex--;
            updatePaginationUI();
            renderCanvas();
        }
    }
    function nextRecipient() {
        if (state.currentIndex < state.recipients.length - 1) {
            state.currentIndex++;
            updatePaginationUI();
            renderCanvas();
        }
    }

    btnPrevRecipient.addEventListener('click', prevRecipient);
    btnNextRecipient.addEventListener('click', nextRecipient);
    btnBottomPrev.addEventListener('click', prevRecipient);
    btnBottomNext.addEventListener('click', nextRecipient);

    // Typography Inspector Event Handlers
    fontFamilySelect.addEventListener('change', (e) => {
        state.elements[state.selectedElementKey].fontFamily = e.target.value;
        renderCanvas();
    });

    fontSizeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        fontSizeValue.textContent = `${val}px`;
        state.elements[state.selectedElementKey].fontSize = val;
        renderCanvas();
    });

    btnToggleBold.addEventListener('click', () => {
        const elem = state.elements[state.selectedElementKey];
        elem.fontWeight = elem.fontWeight === 'bold' ? 'normal' : 'bold';
        updateInspectorUI();
        renderCanvas();
    });

    btnToggleItalic.addEventListener('click', () => {
        const elem = state.elements[state.selectedElementKey];
        elem.fontStyle = elem.fontStyle === 'italic' ? 'normal' : 'italic';
        updateInspectorUI();
        renderCanvas();
    });

    textColorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        textColorHex.value = color.toUpperCase();
        state.elements[state.selectedElementKey].color = color;
        renderCanvas();
    });

    textColorHex.addEventListener('input', (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            textColorPicker.value = val;
            state.elements[state.selectedElementKey].color = val;
            renderCanvas();
        }
    });

    btnAlignLeft.addEventListener('click', () => { state.elements[state.selectedElementKey].textAlign = 'left'; updateInspectorUI(); renderCanvas(); });
    btnAlignCenter.addEventListener('click', () => { state.elements[state.selectedElementKey].textAlign = 'center'; updateInspectorUI(); renderCanvas(); });
    btnAlignRight.addEventListener('click', () => { state.elements[state.selectedElementKey].textAlign = 'right'; updateInspectorUI(); renderCanvas(); });

    textCaseSelect.addEventListener('change', (e) => {
        state.elements[state.selectedElementKey].textCase = e.target.value;
        renderCanvas();
    });

    // Positioning Sliders
    posXSlider.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        posXValue.textContent = `${pct}%`;
        state.elements[state.selectedElementKey].x = pct / 100;
        renderCanvas();
    });

    posYSlider.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        posYValue.textContent = `${pct}%`;
        state.elements[state.selectedElementKey].y = pct / 100;
        renderCanvas();
    });

    btnCenterHorizontal.addEventListener('click', () => {
        state.elements[state.selectedElementKey].x = 0.50;
        updatePositionSliders();
        renderCanvas();
    });

    btnCenterVertical.addEventListener('click', () => {
        state.elements[state.selectedElementKey].y = 0.50;
        updatePositionSliders();
        renderCanvas();
    });

    // Toolbar Options
    chkSnapGuides.addEventListener('change', (e) => {
        state.snapToGuides = e.target.checked;
    });

    btnResetPositions.addEventListener('click', () => {
        state.elements.name.x = 0.50; state.elements.name.y = 0.48;
        state.elements.signature.x = 0.50; state.elements.signature.y = 0.76;
        updatePositionSliders();
        renderCanvas();
    });

    // Help Modal
    btnOpenHelp.addEventListener('click', () => helpModal.classList.remove('hidden'));
    btnCloseHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
    btnGotItHelp.addEventListener('click', () => helpModal.classList.add('hidden'));

    // ==========================================
    // 7. EXPORT ENGINE (SINGLE PNG & BULK ZIP)
    // ==========================================

    // Download Single PNG
    btnDownloadSingle.addEventListener('click', () => {
        // Render clean frame without active drag bounding box
        renderCanvas({ exportMode: true });

        const currentName = state.recipients[state.currentIndex] || "Certificate";
        const sanitized = currentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const link = document.createElement('a');
        link.download = `Certificate_${sanitized}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();

        // Restore canvas selection box
        renderCanvas();
    });

    // Bulk ZIP Generation via JSZip
    btnGenerateZip.addEventListener('click', async () => {
        if (!window.JSZip) {
            alert('JSZip library is missing. Please check your internet connection.');
            return;
        }

        const total = state.recipients.length;
        if (total === 0) {
            alert('Please enter at least one recipient name.');
            return;
        }

        // Show Progress Modal
        progressModal.classList.remove('hidden');
        progressBarFill.style.width = '0%';
        progressPercentage.textContent = '0% Completed';
        progressStatusText.textContent = `Preparing to generate ${total} certificates...`;

        const zip = new JSZip();

        // Create Offscreen Canvas for native high-res export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
        const exportCtx = exportCanvas.getContext('2d');

        // Swap canvas context temporarily
        const originalCtx = ctx;
        
        for (let i = 0; i < total; i++) {
            const currentName = state.recipients[i];
            const percent = Math.round(((i + 1) / total) * 100);

            progressStatusText.textContent = `Processing ${i + 1} of ${total}: "${currentName}"`;
            progressBarFill.style.width = `${percent}%`;
            progressPercentage.textContent = `${percent}% Completed`;

            // Temporarily set currentIndex and render on main canvas cleanly
            const prevIndex = state.currentIndex;
            state.currentIndex = i;

            renderCanvas({ exportMode: true });

            // Convert canvas to Blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            
            const sanitized = currentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `Certificate_${String(i + 1).padStart(3, '0')}_${sanitized}.png`;
            
            zip.file(filename, blob);

            state.currentIndex = prevIndex;

            // Yield UI thread to keep progress bar animation smooth
            await new Promise(r => setTimeout(r, 20));
        }

        progressStatusText.textContent = 'Packaging certificates into ZIP archive...';

        const zipContent = await zip.generateAsync({ type: 'blob' });
        
        const zipLink = document.createElement('a');
        zipLink.download = `Certificates_Bulk_Export_${Date.now()}.zip`;
        zipLink.href = URL.createObjectURL(zipContent);
        zipLink.click();

        // Hide Progress Modal & Restore Canvas State
        progressModal.classList.add('hidden');
        renderCanvas();
    });

    // Initial Setup Initialization
    recipientListInput.value = state.recipients.join('\n');
    renderThumbnails();
    
    document.fonts.ready.then(() => {
        updateRecipientsState();
        updateInspectorUI();
        selectPreset('golden');
    });

});
