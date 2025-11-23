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
$title = ($project['title'] ?? 'Project') . ' | Vizstar Builders';
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

</head>

<body data-project-id="<?php echo h($project['id'] ?? ''); ?>">
    <div id="header-placeholder"></div>

    <div class="project-bg-container">
        <img class="project-bg" src="<?php echo h($initialImage); ?>" alt="<?php echo h($initialAlt); ?>" />
        
        <!-- fullscreen controls placed inside .project-bg-container -->
        <button class="project-fullscreen-btn" aria-label="Enter full screen" title="Full screen"><i class="fas fa-expand"></i></button>
        <button class="project-exit-fullscreen-btn" aria-label="Exit full screen" title="Exit full screen"><i class="fas fa-compress"></i></button>
        
        <!-- fullscreen arrows inside container so they're included in fullscreen -->
        <button class="project-fs-arrow left" aria-label="Previous image" title="Previous">&lt;</button>
        <button class="project-fs-arrow right" aria-label="Next image" title="Next">&gt;</button>
    </div>

    <div class="project-main-content expanded">
    <button class="project-arrow left" aria-label="Previous Project">&lt;</button>
        <div class="project-info-card">
            <button class="project-close-btn" aria-label="Close project information" title="Close">
                <i class="fas fa-times"></i>
            </button>
            <div class="project-hide-info">HIDE INFORMATION</div>
            <div class="project-info-content">
                <h1 class="project-title" style="color: black;"><?php echo nl2br(h($project['title'] ?? '')); ?></h1>
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
    <button class="project-arrow right" aria-label="Next Project">&gt;</button>

        
    </div>

    <!-- thumbnails are rendered once inside the .project-bg-container -->

    <div id="slide-menu-placeholder"></div>
    <div id="footer-placeholder"></div>

    <!-- Client-side loader (adds interactions, deep-linking and graceful fallback) -->

    <script src="/assets/js/project-loader.js" defer></script>
    <script src="assets/main.js"></script>
</body>

</html>
