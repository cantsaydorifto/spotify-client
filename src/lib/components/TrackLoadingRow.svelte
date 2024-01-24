<div class="row" class:playing={true} />

<style>
  @keyframes pulse {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .row {
    display: flex;
    align-items: center;
    padding: 7px 5px;
    width: 400px;
    height: 50px;
    margin: 6px 0;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05);
    animation: pulse 2s ease-in-out infinite;
  }
</style>
