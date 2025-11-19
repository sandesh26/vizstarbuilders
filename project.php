<?php

function h($s) { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

$dataPath = __DIR__ . '/assets/data/projects.json';
$json = [];
if (file_exists($dataPath)) {
    $raw = file_get_contents($dataPath);
    $json = json_decode($raw, true) ?: [];
}
$projects = isset($json['projects']) ? $json['projects'] : [];
$requested = isset($_GET['project']) ? $_GET['project'] : null;
$project = null;
if ($requested) {
    foreach ($projects as $p) {
        if (isset($p['id']) && $p['id'] === $requested) { $project = $p; break; }
    }
}
if (!$project && count($projects)) $project = $projects[0];

// Fallback values
$title = $project['title'] ?? 'Project';
$description = $project['description'] ?? '';
$coverIndex = isset($project['coverIndex']) ? (int)$project['coverIndex'] : 0;
$images = $project['images'] ?? [];
$initialImage = $images[$coverIndex]['src'] ?? ($images[0]['src'] ?? 'assets/images/placeholder.jpg');
$initialAlt = $images[$coverIndex]['alt'] ?? ($images[0]['alt'] ?? 'Project image');

// Meta tags for SEO / social
$metaTitle = $title;
$metaDesc = $description;
$metaImage = $initialImage;

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo h($metaTitle); ?></title>
    <meta name="description" content="<?php echo h($metaDesc); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="assets/style.css">

    <!-- Open Graph / Social -->
    <meta property="og:title" content="<?php echo h($metaTitle); ?>">
    <meta property="og:description" content="<?php echo h($metaDesc); ?>">
    <meta property="og:image" content="<?php echo h($metaImage); ?>">
    <meta property="og:type" content="article">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: 'Poppins', Arial, sans-serif;
            background: #fff;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }

        .project-bg-container {
            position: absolute;
            top: 80px;
            left: 40px;
            right: 40px;
            width: calc(100vw - 80px);
            height: calc(100vh - 80px);
            z-index: 5;
        }

        .project-bg {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-bg.transitioning {
            transform: scale(1.05);
            filter: blur(2px);
        }

        .project-main-content {
            position: relative;
            z-index: 10;
            width: 100vw;
            height: 100vh;
            display: flex;
            /* flex-start for collapsed (top), center for expanded - controlled by JS */
            align-items: flex-start;
            justify-content: flex-start;
            padding-left: 8%;
            padding-top: 80px;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-main-content.expanded {
            align-items: center;
            padding-top: 0;
        }

        .project-info-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 30px 35px 30px 35px;
            width: 380px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.14);
            /* animate transform, padding, box-shadow and max-height for smooth slow collapse */
            transition: transform 900ms cubic-bezier(0.22, 0.1, 0.22, 1),
                        padding 700ms cubic-bezier(0.22, 0.1, 0.22, 1),
                        box-shadow 700ms cubic-bezier(0.22, 0.1, 0.22, 1),
                        max-height 900ms cubic-bezier(0.22, 0.1, 0.22, 1);
            overflow: visible;
            /* directional animations: expand from top, collapse to top */
            transform-origin: top center;
            /* default expanded state positioning */
            transform: translateY(-6vh);
            max-height: 1000px;
            position: relative;
        }

        .project-info-card.collapsed {
            padding: 10px 28px;
            gap: 0;
            width: 380px;
            /* use max-height for smoother transition */
            height: 55px;
            justify-content: center;
            align-items: flex-start;
            /* collapsed card stays at top with no transform */
            transform: translateY(0);
            margin-top: 0;
            box-shadow: 0 8px 18px rgba(0,0,0,0.07);
            border-radius: 8px;
        }

        .project-info-content {
            /* content fades smoothly then card shrinks */
            transition: opacity 600ms ease-out, max-height 600ms ease-out;
            opacity: 1;
            max-height: 1000px;
            overflow: hidden;
        }

        .project-info-content.hidden {
            opacity: 0;
            max-height: 0;
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 0;
            padding-bottom: 0;
        }

        .project-hide-info {
            font-size: 0.75rem;
            color: #666;
            font-weight: 500;
            letter-spacing: 0.1em;
            margin-bottom: 12px;
            cursor: pointer;
            text-transform: uppercase;
            transition: color 0.3s ease;
            flex-shrink: 0;
        }

        .project-close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 28px;
            height: 28px;
            border: none;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
            transition: all 0.3s ease;
            z-index: 20;
        }

        .project-close-btn:hover {
            background: rgba(0, 0, 0, 0.2);
            color: #333;
            transform: scale(1.1);
        }

        .project-close-btn:active {
            transform: scale(0.95);
        }

        .project-info-card.closing {
            pointer-events: none;
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            transition: opacity 400ms ease-out, transform 400ms ease-out;
        }

        .project-info-card.collapsed .project-hide-info {
            margin-bottom: 0;
        }

        .project-hide-info:hover {
            color: #444;
        }

        .project-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 16px 0;
            line-height: 1.25;
            letter-spacing: -0.02em;
        }

        .project-desc {
            color: #555;
            font-size: 0.9rem;
            line-height: 1.55;
            margin-bottom: 20px;
            font-weight: 400;
        }

        .project-details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .project-details-table td {
            padding: 8px 0;
            font-size: 0.9rem;
            color: #1a1a1a;
            vertical-align: top;
        }

        .project-details-table td:first-child {
            color: #666;
            font-weight: 500;
            width: 35%;
            padding-right: 15px;
        }

        .project-details-table td:last-child {
            font-weight: 400;
        }

        .project-share-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
        }

        .project-share-label {
            color: #666;
            font-size: 0.9rem;
            font-weight: 500;
            margin-right: 8px;
        }

        .project-share-icons {
            display: flex;
            gap: 12px;
        }

        .project-share-icons a {
            color: #1a1a1a;
            font-size: 1rem;
            transition: color 0.2s;
            text-decoration: none;
        }

        .project-share-icons a:hover {
            color: #666;
        }

        .project-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: #1a1a1a;
            cursor: pointer;
            z-index: 15;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        .project-arrow:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .project-arrow:active {
            transform: translateY(-50%) scale(1.05);
        }

        .project-arrow.left {
            left: 40px;
        }

        .project-arrow.right {
            right: 40px;
        }

        .project-thumbnail-strip {
            position: absolute;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 8px;
            z-index: 20;
            max-width: calc(100% - 60px);
            flex-wrap: wrap;
            justify-content: flex-end;
        }

        .project-thumbnail {
            width: 60px;
            height: 40px;
            object-fit: cover;
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid transparent;
            filter: grayscale(0.5);
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            pointer-events: auto;
            z-index: 30;
        }

        .project-thumbnail:hover {
            opacity: 0.9;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            filter: grayscale(0);
            border-color: rgba(255, 255, 255, 0.6);
        }

        .project-thumbnail.active {
            opacity: 1;
            border-color: rgba(255, 255, 255, 0.8);
            filter: grayscale(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            .project-bg-container {
                top: 60px;
                left: 10px;
                right: 10px;
                width: calc(100vw - 20px);
                height: calc(100vh - 60px);
            }

            .project-main-content {
                justify-content: center;
                padding-left: 0;
                padding-top: 100px;
                align-items: center;
            }

            .project-info-card {
                width: 90vw;
                max-width: 350px;
                padding: 30px 25px;
                transform: translateY(-4vh);
            }

            .project-arrow.left {
                left: 15px;
            }

            .project-arrow.right {
                right: 15px;
            }

            .project-thumbnail-strip {
                bottom: 15px;
                right: 15px;
                max-width: calc(100% - 30px);
                gap: 6px;
                display: none; /* Hide thumbnails on mobile */
            }

            .project-thumbnail {
                width: 50px;
                height: 35px;
            }

            .project-thumbnail:hover {
                transform: translateY(-1px) scale(1.05);
            }

            .project-thumbnail.active {
                transform: scale(1.1);
            }
        }
    </style>
</head>

<body data-project-id="<?php echo h($project['id'] ?? ''); ?>">
    <div id="header-placeholder"></div>

    <div class="project-bg-container">
        <img class="project-bg" src="<?php echo h($initialImage); ?>" alt="<?php echo h($initialAlt); ?>" />
    </div>

    <div class="project-main-content expanded">
        <button class="project-arrow left" aria-label="Previous Project"><i class="fas fa-chevron-left"></i></button>
        <div class="project-info-card">
            <button class="project-close-btn" aria-label="Close project information" title="Close">
                <i class="fas fa-times"></i>
            </button>
            <div class="project-hide-info">HIDE INFORMATION</div>
            <div class="project-info-content">
                <h1 class="project-title"><?php echo nl2br(h($project['title'] ?? '')); ?></h1>
                <p class="project-desc"><?php echo h($project['description'] ?? ''); ?></p>
                <?php
                // Render only non-empty detail rows
                $details = [
                    'Client' => $project['client'] ?? '',
                    'Completion' => $project['completion'] ?? '',
                    'Project Type' => $project['projectType'] ?? '',
                    'Architects' => $project['architects'] ?? '',
                ];
                $rows = [];
                foreach ($details as $label => $val) {
                    if (!is_null($val) && trim((string)$val) !== '') {
                        $rows[] = '<tr><td>' . h($label) . '</td><td>' . h($val) . '</td></tr>';
                    }
                }
                if (count($rows)) {
                    echo '<table class="project-details-table">' . implode("\n", $rows) . '</table>';
                }
                ?>
            </div>
        </div>
        <button class="project-arrow right" aria-label="Next Project"><i class="fas fa-chevron-right"></i></button>

        <div class="project-thumbnail-strip">
            <?php
            // render thumbnails server-side for SEO and immediate layout
            foreach ($images as $i => $img) {
                $src = $img['src'] ?? 'assets/images/placeholder.jpg';
                $alt = $img['alt'] ?? "Thumbnail " . ($i + 1);
                $active = ($i === $coverIndex) ? ' active' : '';
                echo '<img src="' . h($src) . '" alt="' . h($alt) . '" class="project-thumbnail' . $active . '" data-idx="' . $i . '">';
            }
            ?>
        </div>
    </div>

    <div id="slide-menu-placeholder"></div>
    <div id="footer-placeholder"></div>

    <!-- Client-side loader (adds interactions, deep-linking and graceful fallback) -->
    <script src="/assets/js/project-loader.js" defer></script>
    <script src="assets/main.js"></script>
</body>

</html>
